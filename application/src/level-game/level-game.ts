import { LogManager, BindingEngine, inject } from 'aurelia-framework';
import { AiBoard } from '../board/boards/ai-board';
import { States } from '../tile/tile';
import { NPC } from '../player/npcs';
import { Skynet } from '../skynet/skynet';
import { Levels, Level } from '../level-select/levels';

const logger = LogManager.getLogger('level-game');

@inject(BindingEngine)
export class LevelGame {
    /** The game board being used */
    public board: AiBoard;
    /** The AI being used */
    public ai: Skynet;
    /** The NPC that the player is playing against */
    public npc: NPC;
    /** The display status to show the user playing the game */
    public status: string;
    /** The aurelia binding engine */
    private bindingEngine: BindingEngine;
    /** The current level being played */
    private level: Level;


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
        this.level = Levels.getLevelByNumber(parseInt(params.id, 10));
        this.board = this.level.board;
        this.ai = this.level.ai;
        this.npc = this.level.npc;
    }

    /**
     * Aurelia attached lifecycle method, sets up the game initially and starts listening
     * for the count of empty tiles to go to zero.
     */
    public attached() {
        this.bindingEngine.propertyObserver(this.board, 'emptyCount').subscribe(this.handleAiTurn);
        //this.bindingEngine.propertyObserver(this.board, 'emptyCount').subscribe(this.handleGameEnd);
    }

    /**
     * Method to handle when a game ends, pauses for a few seconds
     * then resets the board and disables the appropriate tiles.
     */
    private handleGameEnd = (newValue?: any, oldValue?: any) => {
        if (newValue === 0) {
            logger.info("Game over, starting new game");
            this.status = "Game over, starting new game";
            setTimeout(() => {
                this.board.disable();
                this.resetBoard();
                if (this.board.turn === States.PLAYER1) {
                    this.board.enable();
                }
            }, 2000);
        }
    }

    /**
     * Handles online multiplayer turns by watching the board for empty
     * tile changes and then enabling/disabling the board and pushing moves
     * to the server.
     */
    private handleAiTurn = (newValue?: any, oldValue?: any) => {
        if (newValue === 0) {
            this.handleGameEnd(0, 0);
            return;
        }
        if (this.board.turn === States.PLAYER1) {
            this.status = 'Your move.';
        } else if (this.board.turn === States.PLAYER2) {
            this.status = 'AI move.';
            setTimeout(() => {
                const aiMove = this.ai.makeMove(this.board);
                if (aiMove !== undefined) {
                    this.board.place(aiMove.x, aiMove.y, true);
                } else {
                    logger.error("AI returned undefined move!");
                }
            }, 750);
        }
    }

    /**
     * Resets the board... feel free to change the board layout here
     */
    private resetBoard() {
        this.board.reset();
    }
}
