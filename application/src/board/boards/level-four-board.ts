import { LogManager, useView } from 'aurelia-framework';
import { States } from '../../tile/tile';
import { Layout, Layouts } from '../layouts';
import { Coordinate } from '../board';
import { AiBoard } from './ai-board';

const logger = LogManager.getLogger('level-four-board');

@useView('../board.html')

/**
 * Class defining the gameboard and game logic for level 4
 * @class
 */
export class LevelFourBoard extends AiBoard {

    /** 
     * The size of one of the sides of the square game board.  Must be an
     * odd number smaller than or equal to the size of the board.
     */
    private squareSize: number = 3;

    /** 
     * Clone the layout because we are going to be modifying it and 
     * don't want to mess up other levels that use this layout
     */
    public layout: Layout = JSON.parse(JSON.stringify(Layouts.standard));

    /**
     * The concept of this board is to expand out from the middle.  On
     * initialization we need to set the list of blocked out tiles to 
     * be everything but the middle tiles.
     */
    public constructor() {
        super();
        this.layout.blockedOutTiles = this.getBlockOutList();
    }

    /**
     * Check if the given coordinates are within bounds of the allowed
     * board region.  This is used to figure out what tiles to enable
     * as the board expands as well as what tiles are disabled to begin with.
     * @param {number} x the horizontal coordinate
     * @param {number} y the vertical coordinate
     */
    private checkBounds(x: number, y: number): boolean {
        const squareMin: number = Math.round((this.layout.height / 2) - (this.squareSize / 2)) - 1;
        const squareMax: number = Math.round((this.layout.height / 2) + (this.squareSize / 2));
        console.log(squareMin, squareMax);
        if (y <= squareMin || y >= squareMax || x <= squareMin || x >= squareMax) {
            return false;
        }
        return true;
    }

    /**
     * Places the tile and then determines whether or not to expand the board.
     * If the board needs to be expanded, it will reset the necessary tiles
     * and splice them from the blockedOutTiles list.
     * @param {number} x the horizontal coordinate
     * @param {number} y the vertical coordinate
     * @param {boolean} isAI true if the AI is making the move, false otherwise
     */
    public place(x: number, y: number, isAI: boolean = false): boolean {
        const value: boolean = super.place(x, y, isAI);
        if (this.emptyCount < ((this.squareSize * this.squareSize) / 4)) {
            if (this.squareSize === this.layout.height) {
                return value;
            }
            this.squareSize += 2;
            for (let i = this.layout.blockedOutTiles.length - 1; i >= 0; i--) {
                const coord: Coordinate = this.layout.blockedOutTiles[i];
                if (this.checkBounds(coord.x, coord.y)) {
                    this.tiles[coord.y][coord.x].reset();
                    this.layout.blockedOutTiles.splice(i, 1);
                }
            }
        }
        return value;
    }

    /**
     * Gets a list of the blocked out tiles based on the starting layout
     * and the current bounds allowed.
     */
    private getBlockOutList() {
        const blockedOutTiles: Array<Coordinate> = [];
        for (let y = 0; y < this.layout.height; y++) {
            for (let x = 0; x < this.layout.width; x++) {
                if (!this.checkBounds(x, y)) {
                    blockedOutTiles.push(<Coordinate>{x, y});
                }
            }
        }
        return blockedOutTiles;
    }

    /**
     * Need to reset the square size when resetting the board.
     */
    public reset() {
        this.squareSize = 3;
        this.layout.blockedOutTiles = this.getBlockOutList();
        super.reset();
    }

}
