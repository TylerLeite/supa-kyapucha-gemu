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
export class LevelSixBoard extends AiBoard {

    /** The number of moves in a row the AI can make */
    private sequentialMoves: number = 7;
    /** The number of tiles to flip back */
    private flipBacks: number = 3;
    /** Keeps track of how many moves in a row the AI has made */
    private moveCounter: number = 0;
    /** Standard layout to not freak out the player too much */
    public layout: Layout = Layouts.standard;
    /** Keeps track of placed tile coordinates so we can sneakily flip them back */
    public placedTiles: Array<Coordinate>;


    public place(x: number, y: number, isAI: boolean = false): boolean {
        const value: boolean = super.place(x, y, isAI);
        if (value) {
            this.placedTiles.push(<Coordinate>{x, y});
            this.moveCounter += 1;
            if (this.moveCounter === this.sequentialMoves) {
                for (let i = 0; i < this.flipBacks; i++) {
                    const index: number = Math.floor(Math.random() * this.placedTiles.length);
                    const coord: Coordinate = this.placedTiles[index];
                    this.tiles[coord.y][coord.x].reset();
                    this.placedTiles.splice(index, 1);
                }
                this.moveCounter = 0;
            }
        }
        return value;
    }

    /**
     * Stops from enabling the board while the AI is making
     * multiple moves in a row
     */
    public enable() {
        if (this.moveCounter === this.sequentialMoves) {
            return;
        }
        super.enable();
    }

    public reset() {
        this.moveCounter = 0;
        this.placedTiles = [];
        super.reset();
    }
}
