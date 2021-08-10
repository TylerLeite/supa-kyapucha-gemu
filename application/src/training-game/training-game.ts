import { LogManager, BindingEngine, inject } from 'aurelia-framework';
import { AiBoard } from '../board/boards/ai-board';
import { States } from '../tile/tile';
import { Skynet } from '../skynet/skynet';
import { RockWithFaceAi } from 'skynet/npc-ais/rock-with-face-ai';
import { DQN } from 'skynet/dqn';
import * as Boards from "../board/boards/boards";

const logger = LogManager.getLogger('level-game');

@inject(BindingEngine)
export class TrainingGame {
    /** The game board being used */
    public board: AiBoard;
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
    /** A queue to keep track of the last 10 games */
    public lastTenQueue: Array<number> = new Array<number>();
    /** The aurelia binding engine */
    private bindingEngine: BindingEngine;


    /**
     * The constructor method of the local game
     * @param {BindingEngine} be the aurelia binding engine (injected in)
     */
    public constructor(be: BindingEngine) {
        this.bindingEngine = be;
    }

    /**
     * Called upon activation lifecycle method, can be used to look
     * at the navigation parameters passed in.
     * @param params the parameters passed in, here we just use params.id which is the level number
     */
    public activate(params): void {
        this.teacher = new RockWithFaceAi();
        this.board = new Boards.LevelOneBoard();
        this.student = new DQN(this.board.width, this.board.height);
        while(true) {
            setTimeout(() => {
                this.playGame();
            })
        }
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

    /**
     * Method to handle when a game ends, pauses for a few seconds
     * then resets the board and disables the appropriate tiles.
     */
    private handleGameEnd = () => {
        logger.info("Game over, starting new game");
        this.totalGamesPlayed += 1;
        if (this.board.player1Count > this.board.player2Count) {
            this.totalWins += 1;
            (<DQN>this.student).reward(1);
            this.lastTenQueue.push(1);
        } else {
            this.totalLosses += 1;
            (<DQN>this.student).reward(-1);
            this.lastTenQueue.push(0);
        }
        if (this.lastTenQueue.length > 10) {
            this.lastTenQueue.shift();
        }
        this.lastTenWins = this.lastTenQueue.reduce((a, b) => {return a+b}, 0);

        setTimeout(() => {
            this.board.disable();
            this.resetBoard();
        });
    }

    /**
     * Handles online multiplayer turns by watching the board for empty
     * tile changes and then enabling/disabling the board and pushing moves
     * to the server.
     */
    private playGame = () => {
        if (this.board.emptyCount === 0) {
            this.handleGameEnd();
            return;
        }
        if (this.board.turn === States.PLAYER1) {
            const studentMove = this.student.makeMove(this.board);
            if (studentMove !== undefined) {
                this.board.place(studentMove.x, studentMove.y, true);
            }
        } else if (this.board.turn === States.PLAYER2) {
            const teacherMove = this.teacher.makeMove(this.board);
            if (teacherMove !== undefined) {
                this.board.place(teacherMove.x, teacherMove.y, true);
            }
        }
    }

    /**
     * Resets the board... feel free to change the board layout here
     */
    private resetBoard() {
        this.board.reset();
    }
}
