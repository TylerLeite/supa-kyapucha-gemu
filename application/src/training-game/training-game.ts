import { LogManager, BindingEngine, inject } from 'aurelia-framework';
import { Tile, States } from '../tile/tile';
import { Skynet } from '../skynet/skynet';
import { BillAi } from 'skynet/npc-ais/bill-ai';
import { DQN } from 'skynet/dqn';
import { Board } from '../board/board';


const logger = LogManager.getLogger('level-game');

@inject(BindingEngine)
export class TrainingGame {
    /** The game board being used */
    public board: Board;
    /** The AI teacher being used */
    public teacher: Skynet;
    /** The AI student being trained */
    public student: Skynet;
    /** The number of games played in this training session */
    public totalGamesPlayed: number = 0;
    /** The number of wins in this training session */
    public totalWins: number = 0;
    /** The number of losses in this training session */
    public totalLosses: number = 0;
    /** The number of games in the last 10 that were won */
    public lastTenWins: number = 0;
    /** The number of games in the last 100 that were won */
    public last100Wins: number = 0;
    /** The number of games in the last 1000 that were won */
    public last1000Wins: number = 0;
    /** A queue to keep track of the last 10 games */
    public last1000Queue: Array<number> = new Array<number>();
    /** The average reward over the last 100 games */
    public averageReward: number = 0;
    /** A queue of the last 100 rewards */
    public rewardQueue: Array<number> = new Array<number>();
    /** The aurelia binding engine */
    private bindingEngine: BindingEngine;

    public results = new Array<any>();


    /**
     * The constructor method of the local game
     * @param {BindingEngine} be the aurelia binding engine (injected in)
     */
    public constructor(be: BindingEngine) {
        this.bindingEngine = be;
    }

    private clearStats() {
        this.totalWins = 0;
        this.totalLosses = 0;
        this.totalGamesPlayed = 0
        this.last1000Queue = new Array<number>();
        this.rewardQueue = new Array<number>();
    }

    /**
     * Called upon activation lifecycle method, can be used to look
     * at the navigation parameters passed in.
     * @param params the parameters passed in, here we just use params.id which is the level number
     */
    public activate(params): void {
        this.teacher = new BillAi();
        this.board = this.getNewBoard();
        const spec = this.getRandomSpec();
        this.student = new DQN(this.board.width, this.board.height, spec);
        const trainingDuration = 200000;
        let testing = false;
        const interval = setInterval(() => {
            this.playGame();
            if (this.totalGamesPlayed === trainingDuration) {
                this.clearStats();
                (<DQN>this.student).lockLearning();
                testing = true;
            }
            if (this.totalGamesPlayed === 100 && testing) {
                const result = {
                    alpha: spec.alpha,
                    gamma: spec.gamma,
                    epsilon: spec.epsilon,
                    experience_size: spec.experience_size,
                    experience_add_every: spec.experience_add_every,
                    learning_steps_per_iteration: spec.learning_steps_per_iteration,
                    num_hidden_units: spec.num_hidden_units,
                    total_games_played: trainingDuration,
                    score: this.totalWins / this.totalLosses
                }
                this.results.push(result);
                this.results.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0))
                if (this.results.length > 100) {
                    this.results.pop();
                }
                this.download(JSON.stringify((<DQN>this.student).getJSON()), 'agent.txt', 'text/plain');
                this.clearStats();
                testing = false;
                clearInterval(interval);
                return;
            }
        });
    }

    /**
     * Aurelia attached lifecycle method, sets up the game initially and starts listening
     * for the count of empty tiles to go to zero.
     */
    public attached() {
    }

    public detached() {
        this.resetBoard();
    }

    private getRandomSpec(): any {
        return {
            alpha: 0.005,
            gamma: 0.9,
            epsilon: 0.2,
            experience_size: 50000,
            experience_add_every: 5,
            learning_steps_per_iteration: 5,
            num_hidden_units: 100
        }
    }

    private getRandomArbitrary(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    private getNewBoard(): Board {
        const board = new Board();
        board.height = 7;
        board.width = 7;
        board.tiles = [];
        board.turn = States.PLAYER1;
        for (let y = 0; y < board.height; y++) {
            board.tiles[y] = [];

            for (let x = 0; x < board.width; x++) {
                board.tiles[y][x] = new Tile();
                board.tiles[y][x].state = States.EMPTY;
            }
        }

        return board;
    }

    /**
     * Method to handle when a game ends, pauses for a few seconds
     * then resets the board and disables the appropriate tiles.
     */
    private handleGameEnd = () => {
        logger.info("Game over, starting new game");
        this.totalGamesPlayed += 1;
        const reward = this.board.player1Count - this.board.player2Count;
        (<DQN>this.student).reward(reward);
        this.rewardQueue.push(reward);
        if (this.rewardQueue.length > 100) {
            this.rewardQueue.shift();
        }
        this.averageReward = this.rewardQueue.reduce((a, b) => a + b) / this.rewardQueue.length;
        if (this.board.player1Count > this.board.player2Count) {
            this.totalWins += 1;
            this.last1000Queue.push(1);
        } else {
            this.totalLosses += 1;
            this.last1000Queue.push(0);
        }
        if (this.last1000Queue.length > 1000) {
            this.last1000Queue.shift();
            this.last1000Wins = this.last1000Queue.reduce((a, b) => { return a + b }, 0);
        }
        if (this.last1000Queue.length > 100) {
            this.last100Wins = this.last1000Queue.slice(-100).reduce((a, b) => { return a + b }, 0);
        }
        if (this.last1000Queue.length > 10) {
            this.lastTenWins = this.last1000Queue.slice(-10).reduce((a, b) => { return a + b }, 0);
        }
        this.board.reset();
        if (this.averageReward > 0) {
            (<BillAi>this.teacher).changeRandomness(false);
        }
    }

    /**
     * Handles online multiplayer turns by watching the board for empty
     * tile changes and then enabling/disabling the board and pushing moves
     * to the server.
     */
    private playGame = () => {
        while (true) {
            if (this.board.emptyCount === 0) {
                this.handleGameEnd();
                return;
            }
            if (this.board.turn === States.PLAYER1) {
                const studentMove = this.student.makeMove(this.board);
                if (studentMove !== undefined) {
                    this.board.place(studentMove.x, studentMove.y);
                    (<DQN>this.student).reward(1);
                }
            } else if (this.board.turn === States.PLAYER2) {
                const teacherMove = this.teacher.makeMove(this.board);
                if (teacherMove !== undefined) {
                    this.board.place(teacherMove.x, teacherMove.y);
                }
            }
        }
    }

    /**
     * Resets the board... feel free to change the board layout here
     */
    private resetBoard() {
        this.board.reset();
    }

    private download(content, fileName, contentType) {
        const a = document.createElement("a");
        const file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
}
