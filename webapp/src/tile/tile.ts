// import { LogManager } from 'aurelia-framework';

// const logger = LogManager.getLogger('tile');

/**
 * An enum defining the possible states, this is used for whose turn it is
 * as well as who owns a certain tile
 */
export enum States {
    PLAYER1,
    PLAYER2,
    EMPTY
}

/**
 * A class defining a single tile
 * @class
 */
export class Tile {
    /** The state that the tile is currently in */
    private state: States = States.EMPTY;
    /** A reference to the UI tile */
    public tileUi: HTMLElement;
    /** A reference to the UI front of the tile */
    public tileFrontUi: HTMLElement;
    /** A reference to the UI back of the tile */
    public tileBackUi: HTMLElement;
    /** The color when a tile is empty FIXME: support passing an image in instead */
    private emptyColor = "grey";
    /** The color when a tile is owned by player 1 FIXME: support passing an image in instead */
    private player1Color = "red";
    /** The color when a tile is owned by player 2 FIXME: support passing an image in instead */
    private player2Color = "blue";
    /** The css class that can be toggled in order to flip a tile */
    private flipClass = 'is-flipped';

    /** The Aurelia attached lifecycle method, sets the tiles initially to an empty color on load. */
    public attached() {
        this.tileFrontUi.style.backgroundColor = this.emptyColor;
    }

    /** Flips a tile over */
    private flip() {
        this.tileUi.classList.toggle(this.flipClass);
    }

    /** 
     * Returns whether a tile is flipped over or not
     * @returns {boolean} true if the tile is flipped over, false otherwise
     */
    private isFlipped(): boolean {
        return this.tileUi.classList.contains(this.flipClass);
    }

    /**
     * Get the current state of the tile
     * @returns {States} the current state of the tile
     */
    public getState(): States {
        return this.state;
    }

    /**
     * Set the tile to a new state.  This method will check if the tile is empty,
     * and if so, add the newState player's color to the front and the other player's
     * color to the back of the tile.  If the tile is not empty and the state has changed
     * the tile will flip over.
     * @param newState the new state to set the tile to
     */
    public setState(newState: States) {
        if (newState === States.EMPTY) {
            this.reset();
            return;
        }
        if (newState === this.state) {
            return;
        }
        if (this.state === States.EMPTY) {
            if (newState === States.PLAYER1) {
                this.tileFrontUi.style.backgroundColor = this.player1Color;
                this.tileBackUi.style.backgroundColor = this.player2Color;
            } else if (newState === States.PLAYER2) {
                this.tileFrontUi.style.backgroundColor = this.player2Color;
                this.tileBackUi.style.backgroundColor = this.player1Color;
            }
        } else {
            this.flip();
        }
        this.state = newState;
    }

    /**
     * Reset a tile to it's initial state with an empty front and back
     */
    public reset() {
        this.state = States.EMPTY;
        this.tileFrontUi.style.backgroundColor = this.emptyColor;
        this.tileBackUi.style.backgroundColor = this.emptyColor;
        if (this.isFlipped()) {
            this.flip();
        }
    }
}
