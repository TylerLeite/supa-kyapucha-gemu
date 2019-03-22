import { bindable, observable, LogManager } from 'aurelia-framework';
import { Tile, States } from '../tile/tile';
import { Layout } from './layouts';

const logger = LogManager.getLogger('board');

/**
 * Simple interface defining a coordinate
 */
export interface Coordinate {
    x: number;
    y: number;
}

/**
 * Class defining the gameboard and game logic
 * @class
 */
export class Board {
    @bindable @observable public layout: Layout;
    /** The height of the board */
    public height: number;
    /** The width of the board */
    public width: number;
    /** The blocked out tiles on the board */
    public blockedOutTiles: Coordinate[];
    /** A 2D array of tiles that make up the board */
    public tiles: Array<Tile>[];
    /** A reference to the board dom element */
    public boardUi: HTMLElement;
    /** The current turn */
    public turn: States = States.PLAYER1;
    /** The last move that was made */
    public lastMove?: Coordinate;

    /**
     * This kicks off whenever the layout changes, it prepares the board
     * and then disables the tiles once the DOM has finished loading
     * NOTE: This is really a private method, but tslint doesn't understand
     * decorators
     */
    protected layoutChanged() {
        this.assignAttributes();
        setTimeout(() => {
            this.disableTiles();
        });
    }

    /**
     * Get the number of empty tiles on the board
     * @returns {number} - number of empty tiles
     */
    public get emptyCount(): number {
        return this.getCountOfType(States.EMPTY);
    }

    /**
     * Get the number of tiles that player 1 controls on the board
     * @returns {number} - number of player 1 tiles
     */
    public get player1Count(): number {
        return this.getCountOfType(States.PLAYER1);
    }

    /**
     * Get the number of tiles that player 2 controls on the board
     * @returns {number} - number of player 2 tiles
     */
    public get player2Count(): number {
        return this.getCountOfType(States.PLAYER2);
    }

    /** 
     * Place a tile on a particular coordinate on the board
     * @returns {boolean} true if placement succeeded, false otherwise
     */
    public place(x: number, y: number): boolean {
        //logger.debug(`Placing a piece at ${x}, ${y} for player ${this.turn}`);
        /** Check if placement is valid */
        if (this.tiles[y][x].state !== States.EMPTY || !this.inBounds(x, y)) {
            return false;
        }

        /** Set the tile to the current player */
        this.tiles[y][x].state = this.turn;

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
        this.lastMove = {x: x, y: y};
        return true;
    }

    /** Reset the board (set all tiles to empty) */
    public reset() {
        logger.debug("Resetting the board");
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
     * A small helper method that takes the layout and
     * assigns it to various internal attributes that can
     * be accessed easier.
     */
    private assignAttributes() {
        this.height = this.layout.height;
        this.width = this.layout.width;
        this.blockedOutTiles = this.layout.blockedOutTiles;
        this.tiles = new Array<Tile[]>();
        for (let i = 0; i < this.height; i++) {
            this.tiles.push(new Array<Tile>(this.width));
        }
    }

    /**
     * Take in a list of coordinates of tiles to disable, check if coordinates are in bounds
     * and if they are, disable the tile at that coordinate.
     */
    private disableTiles() {
        this.blockedOutTiles.forEach((tile: Coordinate) => {
            if (this.inBounds(tile.x, tile.y)) {
                this.tiles[tile.y][tile.x].state = States.DISABLED;
            }
        });
    }

    /**
     * Get the number of tiles of a certain type (state)
     * @param {State} type - the type of tile to count
     * @returns {number} number of tiles of the type
     */
    private getCountOfType(type: States): number {
        let count = 0;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.tiles[i][j].state === type) {
                    count ++;
                }
            }
        }
        return count;
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
    public checkReversi(sx: number, sy: number, xdir: number, ydir: number, justChecking: boolean = false, depth: number = 0): boolean {
        const nx = sx + xdir;
        const ny = sy + ydir;

        // const turnToCheck = justChecking ? (this.turn + 1) % 2 : this.turn;
        const turnToCheck = this.turn;

        if (!this.inBounds(nx, ny)) {
            return false;
        } else if (this.tiles[ny][nx].state === States.DISABLED) {
            return false;
        } else if (this.tiles[ny][nx].state === States.EMPTY) {
            return false;
        } else if (this.tiles[ny][nx].state === this.turn) {
            if (depth === 0) {
                return false;
            }
            if (this.tiles[sy][sx].state !== this.turn && !justChecking) {
                this.tiles[sy][sx].state = this.turn;
            }
            return true;
        } else {
            if (this.checkReversi(nx, ny, xdir, ydir, justChecking, depth + 1)) {
                if (this.tiles[sy][sx].state !== this.turn && !justChecking) {
                    this.tiles[sy][sx].state = this.turn;
                }
                return true;
            } else {
                return false;
            }
        }
    }
}
