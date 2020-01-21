//import { bindable } from 'aurelia-framework';

// const logger = LogManager.getLogger('tile');

/**
 * An enum defining the possible states, this is used for whose turn it is
 * as well as who owns a certain tile
 */
export enum States {
    PLAYER1,
    PLAYER2,
    EMPTY,
    DISABLED
}

/**
 * A class defining a single tile
 * @class
 */
export class Tile {
    /** A reference to the UI tile */
    public tileUi: HTMLElement | undefined;
    /** A reference to the UI front of the tile */
    public tileFrontUi: HTMLElement;
    /** A reference to the UI back of the tile */
    public tileBackUi: HTMLElement;
    /** The color when a tile is empty */
    public emptyColor: string = "grey";
    /** The image displayed when a tile is empty */
    public emptyImageUrl: string = "";
    /** The color when a tile is owned by player 1 */
    public player1Color: string = "blue";
    /** The image when a tile is owned by player 1 */
    public player1ImageUrl: string = "";
    /** The color when a tile is owned by player 2 */
    public player2Color: string = "red";
    /** The image when a tile is owned by player 2 */
    public player2ImageUrl: string = "";
    /** The image displayed when a tile is disabled */
    public disabledImageUrl: string = "";
    /** The color when a tile is disabled */
    public disabledColor: string = "white";
    /** The color of the front of the tile */
    public tileFrontColor: string = this.emptyColor;
    /** The color of the back of the tile */
    public tileBackColor: string = this.emptyColor;
    /** The url of the image to display on the front of the tile */
    public tileFrontImageUrl: string = "";
    /** The url of the image to display on the back of the tile */
    public tileBackImageUrl: string = "";
    /** The css class that can be toggled in order to flip a tile */
    private flipClass: string = 'is-flipped';
    /** The css class that can be toggled to push in a tile */
    private pushClass: string = 'push';
    /** The state that the tile is currently in */
    private tileState: States = States.EMPTY;

    /**
     * Takes the passed in attrs and assigns them to the Tile object
     * @constructor
     * @param {any} attrs attributes to assign to the tile
     */
    constructor(attrs?: any) {
        if (attrs) {
            Object.assign(this, attrs);
        }
    }

    /** Flips a tile over */
    private flip() {
        if (typeof this.tileUi === 'undefined') { return; }
        this.tileUi.classList.toggle(this.flipClass);
    }

    /** 
     * Returns whether a tile is flipped over or not
     * @returns {boolean} true if the tile is flipped over, false otherwise
     */
    private isFlipped(): boolean {
        if (typeof this.tileUi === 'undefined') { return false; }
        return this.tileUi.classList.contains(this.flipClass);
    }

    /**
     * Returns whether a tile is pushed in already or not
     * @returns {boolean} true if the tile has been pushed in, false otherwise
     */
    private isPushed(): boolean {
        if (typeof this.tileUi === 'undefined') { return false; }
        return this.tileUi.classList.contains(this.pushClass);
    }

    /**
     * Pushes a tile in (on a click for example)
     */
    private push() {
        if (typeof this.tileUi === 'undefined') { return; }
        this.tileUi.classList.toggle(this.pushClass);
    }

    /**
     * Get the current state of the tile
     * @returns {States} the current state of the tile
     */
    public get state(): States {
        return this.tileState;
    }

    /**
     * Set the tile to a new state.  This method will check if the tile is empty,
     * and if so, add the newState player's color to the front and the other player's
     * color to the back of the tile.  If the tile is not empty and the state has changed
     * the tile will flip over.
     * @param newState the new state to set the tile to
     */
    public set state(newState: States) {
        if (this.tileState === States.DISABLED) {
            return;
        }
        switch (newState) {
            case this.tileState: {
                return;
            }
            case States.DISABLED: {
                this.tileFrontColor = this.disabledColor;
                this.tileFrontImageUrl = this.disabledImageUrl;
                this.tileBackColor = this.disabledColor;
                this.tileBackImageUrl = this.disabledImageUrl;
                break;
            }
            case States.EMPTY: {
                this.reset();
                break;
            }
            default: {
                if (this.tileState === States.EMPTY) {
                    this.push();
                    if (newState === States.PLAYER1) {
                        this.tileFrontColor = this.player1Color;
                        this.tileFrontImageUrl = this.player1ImageUrl;
                        this.tileBackColor = this.player2Color;
                        this.tileBackImageUrl = this.player2ImageUrl;
                    } else if (newState === States.PLAYER2) {
                        this.tileFrontColor = this.player2Color;
                        this.tileFrontImageUrl = this.player2ImageUrl;
                        this.tileBackColor = this.player1Color;
                        this.tileBackImageUrl = this.player1ImageUrl;
                    }
                } else {
                    this.flip();
                }
                break;
            }
        }
        this.tileState = newState;
    }

    /**
     * Reset a tile to it's initial state with an empty front and back
     */
    public reset() {
        this.tileFrontColor = this.emptyColor;
        this.tileFrontImageUrl = this.emptyImageUrl;
        this.tileBackColor = this.emptyColor;
        this.tileBackImageUrl = this.emptyImageUrl;
        if (this.isFlipped()) {
            this.flip();
        }
        if (this.isPushed()) {
            this.push();
        }
        this.tileState = States.EMPTY;
    }
}
