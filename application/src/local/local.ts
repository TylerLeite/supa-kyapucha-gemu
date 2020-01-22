import { LogManager, BindingEngine, inject } from 'aurelia-framework';
import { Board } from '../board/board';
import { Layout, Layouts } from '../board/layouts';
import { Player } from '../player/player';
import { NPCs } from '../player/npcs';

const logger = LogManager.getLogger('local');

@inject(BindingEngine)
export class Local {
    /** The game board being used */
    public board: Board;
    /** Player 1 */
    public player1: Player;
    /** Player 2 */
    public player2: Player;
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
        this.player1 = NPCs.random();
        this.player2 = NPCs.random();
        while (this.player1.fullName === this.player2.fullName) {
            this.player2 = NPCs.random();
        }
    }

    /**
     * Aurelia attached lifecycle method, sets up the game initially and starts listening
     * for the count of empty tiles to go to zero.
     */
    public attached() {
        this.bindingEngine.propertyObserver(this.board, 'emptyCount').subscribe(this.handleGameEnd);
        this.board.player1Color = this.player1.color;
        this.board.player2Color = this.player2.color;
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
