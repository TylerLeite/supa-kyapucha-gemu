import { LogManager, BindingEngine, inject } from 'aurelia-framework';
import { Board } from '../board/board';
import { Layouts } from '../board/layouts';

const logger = LogManager.getLogger('local');

@inject(BindingEngine)
export class Local {
    /** The game board being used */
    public board: Board;
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
     * Aurelia attached lifecycle method, sets up the game initially and starts listening
     * for the count of empty tiles to go to zero.
     */
    public attached() {
        logger.debug("attaching the local game");
        this.resetBoard();
        this.bindingEngine.propertyObserver(this.board, 'emptyCount').subscribe(this.handleGameEnd);
    }

    /**
     * Method to handle when a game ends, pauses for a few seconds
     * then resets the board and disables the appropriate tiles.
     */
    private handleGameEnd = (newValue?: any, oldValue?: any) => {
        if (newValue === 0) {
            setTimeout(() => {
                this.resetBoard();
            }, 2000);
        }
    }

    /**
     * Resets the board... feel free to change the board layout here
     */
    private resetBoard() {
        this.board.reset();
        this.board.disableTiles(Layouts.SevenBySeven.cornersCenter);
    }
}
