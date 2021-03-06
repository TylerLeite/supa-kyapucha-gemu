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

    public attached(): void {
        try {
            //tslint:disable-next-line
            if (this.boardUi === undefined) {
                // This is a hack until I can figure out how to pass the board reference in
                this.boardUi = <HTMLElement>document.getElementsByClassName("board")[0];
            }
            this.layoutChanged();
        } catch (err) {
            console.warn(err);
        }
    }

    /**
     * Gets a random integer between 0 and the specified max.
     * @param {number} max the maximum integer for the random number generated\
     * @returns {number} a random number between 0 and max
     */
    protected getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    public reset(): void {
        super.reset();
        this.layoutChanged();
    }
}
