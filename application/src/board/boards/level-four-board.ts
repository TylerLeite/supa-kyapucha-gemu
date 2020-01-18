import { LogManager, useView } from 'aurelia-framework';
import { States } from '../../tile/tile';
import { Layout, Layouts } from '../layouts';
import { Coordinate } from '../board';
import { AiBoard } from './ai-board';

const logger = LogManager.getLogger('level-one-board');

@useView('../board.html')

/**
 * Class defining the gameboard and game logic
 * @class
 */
export class LevelFourBoard extends AiBoard {

    public layout: Layout = Layouts.standard;

    public constructor() {
        super();
        this.layout.blockedOutTiles = this.getBlockOutList();
        //this.layoutChanged();
    }

    private squareSize: number = 3;

    private checkBounds(x, y): boolean {
        const squareMin: number = Math.round((this.layout.height / 2) - (this.squareSize / 2)) - 1;
        const squareMax: number = Math.round((this.layout.height / 2) + (this.squareSize / 2));
        console.log(squareMin, squareMax);
        if (y <= squareMin || y >= squareMax || x <= squareMin || x >= squareMax) {
            return false;
        }
        return true;
    }

    /** 
     * Special placement method for AI games, makes sure that the board
     * is disabled as soon as the user places a tile.  Board re-enables
     * when the AI finishes its turn.
     * @returns {boolean} true if placement succeeded, false otherwise
     */
    public place(x: number, y: number, isAI: boolean = false): boolean {
        const value: boolean = super.place(x, y, isAI);
        if (this.emptyCount < (this.squareSize * this.squareSize) / 2) {
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

}
