import { LogManager, useView } from 'aurelia-framework';
import { Tile, States } from '../../tile/tile';
import { Layout, Layouts } from '../layouts';
import { Coordinate } from '../board';
import { AiBoard } from './ai-board';

const logger = LogManager.getLogger('level-six-board');

@useView('../board.html')

/**
 * Class defining the gameboard and game logic for level 6
 * @class
 */
export class LevelNineBoard extends AiBoard {

    /** The number of moves in a row the AI can make */
    private sequentialMoves: number = 20;
    /** The number of tiles to flip back */
    private flipBacks: number = 15;
    /** The number of extra initial moves before the first random flips */
    private extraInitialMoves: number = 10;
    /** Keeps track of how many moves in a row the AI has made */
    private moveCounter: number = 0 - this.extraInitialMoves;
    /** Standard layout to not freak out the player too much */
    public layout: Layout = Layouts.diamond;
    /** Keeps track of placed tile coordinates so we can sneakily flip them back */
    public placedTiles: Array<Coordinate> = [];
    /** Keeps track of the last count so we can stall the update of the emptyCount getter */
    private lastCount: number = 0;
    /** Keeps track of the number of flips that have yet to occur so we don't have the AI moving to early */
    private flipsToDo: number = 0;

    /**
     * Places a tile.  If the move counter hits the sequential number of moves
     * then flip the number of tiles equal to the flip backs.
     * @param x the x coordinate
     * @param y the y coordinate
     * @param isAI whether or not it is the AI moving
     */
    public place(x: number, y: number, isAI: boolean = false): boolean {
        const value: boolean = super.place(x, y, isAI);
        if (value) {
            this.moveCounter += 1;
            this.placedTiles.push(<Coordinate>{x, y});
            if (this.moveCounter === this.sequentialMoves) {
                this.flipsToDo = this.flipBacks;
                for (let i = 0; i < this.flipBacks; i++) {
                    const index: number = Math.floor(Math.random() * this.placedTiles.length);
                    const coord: Coordinate = this.placedTiles[index];
                    this.fancyReset(this.tiles[coord.y][coord.x]);
                    this.placedTiles.splice(index, 1);
                }
                this.flipBacks += 1;
                setTimeout(() => {
                    this.moveCounter += 1;
                }, 2000);
            }
        }
        return value;
    }

    /** 
     * Makes the tiles being reset more apparent, might revisit this if we
     * like this game board and create a more unique animation.
     */
    private fancyReset(tile: Tile) {
        setTimeout(() => {
            tile.state = States.EMPTY;
            if (!tile.isFlipped()) {
                tile.flip();
            }
            setTimeout(() => {
                tile.flip();
                setTimeout(() => {
                    tile.reset();
                    this.flipsToDo -= 1;
                }, 500);
            }, 500);
        }, 500);
    }

    /**
     * Get the number of empty tiles on the board.  If there are tiles
     * being flipped keep the empty count constant until the dust settles.
     * @returns {number} - number of empty tiles
     */
    public get emptyCount(): number {
        if (this.moveCounter === this.sequentialMoves || this.flipsToDo > 0) {
            return this.lastCount;
        }
        this.lastCount = this.getCountOfType(States.EMPTY);
        return this.lastCount;
    }

    /**
     * Stops from enabling the board while tiles are being flipped
     * multiple moves in a row
     */
    public enable() {
        if (this.moveCounter === this.sequentialMoves) {
            return;
        }
        super.enable();
    }

    /**
     * Resets the board and the move counter.
     */
    public reset() {
        this.moveCounter = 0 - this.extraInitialMoves;
        this.placedTiles = [];
        super.reset();
    }
}
