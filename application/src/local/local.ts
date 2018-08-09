import { LogManager, BindingEngine, inject } from 'aurelia-framework';
import { Board } from '../board/board';
import { Layout, Layouts } from '../board/layouts';

const logger = LogManager.getLogger('local');

@inject(BindingEngine)
export class Local {
    /** The game board being used */
    public board: Board;
    /** The aurelia binding engine */
    private bindingEngine: BindingEngine;
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
        this.bindingEngine.propertyObserver(this.board, 'emptyCount').subscribe(this.handleGameEnd);
    }

    /**
     * Method to handle when a game ends, pauses for a few seconds
     * then resets the board and disables the appropriate tiles.
     */
    private handleGameEnd = (newValue?: any, oldValue?: any) => {
        if (newValue === 0) {
            logger.info("Game over, starting new game");
            setTimeout(() => {
                this.layout = Layouts.random();
                this.resetBoard();
            }, 2000);
        }
    }

    /**
     * Resets the board... feel free to change the board layout here
     */
    private resetBoard() {
        this.board.reset();
    }
}
