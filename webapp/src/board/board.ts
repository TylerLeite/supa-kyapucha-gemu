import { bindable, LogManager } from 'aurelia-framework';
import { Tile, States } from '../tile/tile';

const logger = LogManager.getLogger('board');

/**
 * Class defining the gameboard and game logic
 * @class
 */
export class Board {
    /** The height of the board */
    @bindable public height: number;
    /** The width of the board */
    @bindable public width: number;
    /** A 2D array of tiles that make up the board */
    public tiles: Array<Tile>[] = new Array<Tile[]>();
    /** A reference to the board dom element */
    public boardUi: HTMLElement;
    /** The current turn */
    private turn: States = States.PLAYER1;
    /** Number of empty tiles on the board */
    private emptyTiles: number;
    /** The last move that was made */
    private lastMove: {x?: number, y?: number} = {x: undefined, y: undefined} ;

    /** Aurelia bind method, occurs when binding happens */
    public bind() {
        for (let i = 0; i < this.height; i++) {
            this.tiles.push(new Array<any>(this.width));
        }
        this.emptyTiles = this.height * this.width;
    }

    /**
     * Get the current turn 
     * @returns {States} ie: States.PLAYER1 (whose turn it is) 
     */
    public getTurn() {
        return this.turn;
    }

    /**
     * Get the number of empty tiles remaining
     * @returns {number} number of empty tiles
     */
    public getEmptyTileNum() {
        return this.emptyTiles;
    }

    /**
     * Get the coordinates of the last move that was made
     * @returns {{x?: number, y?: number}} a set of coordinates FIXME: make an interface for this
     */
    public getLastTurn(): {x?: number, y?: number} {
        return this.lastMove;
    }

    /** 
     * Set the current turn
     * @param {States} turn - the turn to set
     */
    public setTurn(turn: States) {
        this.turn = turn;
    }

    /** 
     * Place a tile on a particular coordinate on the board
     * @returns {boolean} true if placement succeeded, false otherwise
     */
    public place(x: number, y: number): boolean {
        /** Check if placement is valid */
        if (this.tiles[y][x].getState() !== States.EMPTY || !this.inBounds(x, y)) {
            return false;
        }

        /** Set the tile to the current player */
        this.tiles[y][x].setState(this.turn);

        /** Flip appropriate tiles */
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                this.checkReversi(x, y, i, j);
            }
        }

        /** Set the turn */
        if (this.turn === States.PLAYER1) {
            this.turn = States.PLAYER2;
        } else {
            this.turn = States.PLAYER1;
        }

        /** Update other stats */
        this.emptyTiles -= 1;
        this.lastMove = {x: x, y: y};
        return true;
    }

    /** Reset the board (set all tiles to empty) */
    public reset() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.tiles[i][j].reset();
            }
        }
    }

    /** 
     * Check if a set of coordinates is in bounds 
     * @param {number} x the horizontal coordinate
     * @param {number} y the vertical coordinate
     * @returns {boolean} true if in bounds, false otherwise
     */
    public inBounds(x: number, y: number): boolean {
        if (x >= this.width || x < 0) {
            return false;
        }
        if (y >= this.height || y < 0) {
            return false;
        }
        return true;
    }

    /** 
     * Given a starting coordinate and a direction, flip appropriate tiles in that direction.
     * Using combinations of xdir and ydir such as (1, 1) will form a diagonal direction.
     * @param {number} sx the starting x coordinate
     * @param {number} sy the starting y coordinate
     * @param {number} xdir (-1, 0 or 1) to define left, center, or right
     * @param {number} ydir (-1, 0 or 1) to define down, center, or up
     * @returns {boolean} true if the call succeeded, false otherwise
     */
    public checkReversi(sx: number, sy: number, xdir: number, ydir: number): boolean {
        const nx = sx + xdir;
        const ny = sy + ydir;

        if (!this.inBounds(nx, ny)) {
            return false;
        } else if (this.tiles[ny][nx].getState() === States.EMPTY) {
            return false;
        } else if (this.tiles[ny][nx].getState() === this.turn) {
            if (this.tiles[sy][sx].getState() !== this.turn) {
                this.tiles[sy][sx].setState(this.turn); // Comment this out if just checking
            }
            return true;
        } else {
            if (this.checkReversi(nx, ny, xdir, ydir)) {
                if (this.tiles[sy][sx].getState() !== this.turn) {
                    this.tiles[sy][sx].setState(this.turn); // Comment this out if just checking
                }
                return true;
            } else {
                return false;
            }
        }
    }
}
