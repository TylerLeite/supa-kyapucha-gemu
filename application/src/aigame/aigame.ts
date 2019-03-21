import { LogManager, BindingEngine, inject } from 'aurelia-framework';
import { Board } from '../board/board';
import { Layout, Layouts } from '../board/layouts';

import { States } from '../tile/tile';
import { mcts } from '../skynet/mcts';

const logger = LogManager.getLogger('local');

@inject(BindingEngine)
export class Aigame {
    /** The game board being used */
    public board: Board;
    /** The display status to show the user playing the game */
    public status: string;
    /** The aurelia binding engine */
    private bindingEngine: BindingEngine;
    /** A reference to the board dom object */
    private boardUi: HTMLElement;
    /** The class for enabling or disabling the UI */
    private disableClass = 'is-disabled';
    /** The current layout being used */
    public layout: Layout = Layouts.random();

    /**
     * The constructor method of the local game
     * @param {BindingEngine} be the aurelia binding engine (injected in)
     */
    public constructor(be: BindingEngine) {
        this.bindingEngine = be;
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
                this.layout = Layouts.random();
                this.resetBoard();
            }, 2000);
        }
    }

    /**
     * Handles online multiplayer turns by watching the board for empty
     * tile changes and then enabling/disabling the board and pushing moves
     * to the server.
     */
    private handleAiTurn = (newValue?: any, oldValue?: any) => {
        if (this.board.turn === States.PLAYER1) {
            this.status = 'Your move.';
            this.enable();
        } else if (this.board.turn === States.PLAYER2) {
            //*
            this.status = ''
            + '01100011 01101111 01101101 01110000 01110101 01110100 '
            + '01101001 01101110 01100111 00100000 01101111 01110000 '
            + '01110100 01101001 01101101 01100001 01101100 00100000 '
            + '01101101 01101111 01110110 01100101';
            //*/ 
            this.disable();
            const aiMove = mcts(this.board);
            if (typeof aiMove === 'undefined') {
                this.handleGameEnd(0, 0);
            } else {
                this.board.place(aiMove.x, aiMove.y);
            }
            //this.enable();
        }
    }

    /**
     * Disables the board
     */
    private disable() {
        if (!this.boardUi.classList.contains(this.disableClass)) {
            this.boardUi.classList.add(this.disableClass);
        }
    }

    /**
     * Enables the board
     */
    private enable() {
        if (this.boardUi.classList.contains(this.disableClass)) {
            this.boardUi.classList.remove(this.disableClass);
        }
    }

    /**
     * Resets the board... feel free to change the board layout here
     */
    private resetBoard() {
        this.board.reset();
    }
}
