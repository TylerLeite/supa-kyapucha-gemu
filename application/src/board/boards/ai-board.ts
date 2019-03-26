import { LogManager, useView } from 'aurelia-framework';
import { Board } from '../board';

const logger = LogManager.getLogger('ai-board');

@useView('../board.html')

/**
 * Board specifically for games involving an AI
 * @class
 */
export class AiBoard extends Board {
    /** 
     * Special placement method for AI games, makes sure that the board
     * is disabled as soon as the user places a tile.  Board re-enables
     * when the AI finishes its turn.
     * @returns {boolean} true if placement succeeded, false otherwise
     */
    public place(x: number, y: number, isAI: boolean = false): boolean {
        if (this.boardDisabled && !isAI) {
            return false;
        }
        this.disable();
        if (super.place(x, y)) {
            if (isAI) {
                this.enable();
            }
            return true;
        } else {
            this.enable();
            return false;
        }
    }
}
