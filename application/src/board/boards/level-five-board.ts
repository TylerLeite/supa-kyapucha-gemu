import { LogManager, useView } from 'aurelia-framework';
import { Tile, States } from '../../tile/tile';
import { Layout, Layouts } from '../layouts';
import { Coordinate } from '../board';
import { AiBoard } from './ai-board';

const logger = LogManager.getLogger('level-five-board');

@useView('../board.html')

/**
 * Class defining the gameboard and game logic for level 5
 * @class
 */
export class LevelFiveBoard extends AiBoard {

    /** The list of critter tile objects on the board */
    private critterTiles: Array<Tile> = [];
    /** The list of the coordinates for the critter tiles */
    private critterTileCoordinates: Array<Coordinate> = [];
    /** The total number of critters to generate */
    private numCritters: number = 7;

    /**
     * Standard layout that is going to be modified so we make a clone
     */
    public layout: Layout = JSON.parse(JSON.stringify(Layouts.standard));

    /**
     * Little bit hacky, but we need to generate the critter tiles
     * and reset the board after we generate the initial board so that
     * the critter tiles render correctly.  May revisit this to make it
     * cleaner in the future.
     */
    public attached(): void {
        //tslint:disable-next-line
        if (this.boardUi === undefined) {
            // This is a hack until I can figure out how to pass the board reference in
            this.boardUi = <HTMLElement>document.getElementsByClassName("board")[0];
        }
        this.layoutChanged();
        setTimeout(() => {
            this.reset();
        });
    }

    /**
     * Get the number of tiles of critter tiles owned by a player
     * @param {State} type - the player state to count
     * @returns {number} number of critter tiles owned
     */
    private getCritterCount(type: States): number {
        let count = 0;
        for (let i = 0; i < this.critterTiles.length; i++) {
            if (this.critterTiles[i].state === type) {
                count ++;
            }
        }
        return count;
    }

    /**
     * Get the number of tiles that player 1 controls on the board
     * @returns {number} - number of player 1 tiles
     */
    public get player1Count(): number {
        return this.getCritterCount(States.PLAYER1);
    }

    /**
     * Get the number of tiles that player 2 controls on the board
     * @returns {number} - number of player 2 tiles
     */
    public get player2Count(): number {
        return this.getCritterCount(States.PLAYER2);
    }

    /**
     * Returns the list of critter coordinates... used by the AI.
     * @returns {Array<Coordinate>} an array of critter tile coordinates
     */
    public getCritterTileCoordinates(): Array<Coordinate> {
        return this.critterTileCoordinates;
    }

    /**
     * Checks for neighboring tiles to avoid placing all the critters in one
     * spot.  Also limits one critter per board edge max.
     * @param {number} x the horizontal coordinate of the potential critter 
     * @param {number} y the vertical coordinate of the potential critter
     */
    private checkForNeighbors(x: number, y: number): boolean {
        for (let i = 0; i < this.critterTileCoordinates.length; i++) {
            const coord: Coordinate = this.critterTileCoordinates[i];
            if ((coord.x === x && (coord.y === y + 1 || coord.y === y - 1)) ||
                (coord.y === y && (coord.x === x + 1 || coord.x === x - 1)) ||
                (coord.x === x + 1 && (coord.y === y + 1 || coord.y === y - 1)) ||
                (coord.x === x - 1 && (coord.y === y + 1 || coord.y === y - 1))) {
                    return true;
            }
            if (coord.x === x) {
                if (x === this.layout.width - 1 || x === 0) {
                    return true;
                }
            }
            if (coord.y === y ) {
                if (y === this.layout.height - 1 || y === 0) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Generates random critter tiles on the board
     */
    private generateRandomCritterTiles() {
        this.critterTiles = [];
        this.critterTileCoordinates = [];
        let numCritters: number = this.numCritters;
        while (numCritters > 0) {
            const randomX = this.getRandomInt(this.layout.width);
            const randomY = this.getRandomInt(this.layout.height);
            if (this.checkForNeighbors(randomX, randomY)) {
                continue;
            }
            if (this.tiles[randomY][randomX].emptyImageUrl !== 'img/pieces/squirrel.png') {
                this.tiles[randomY][randomX].emptyImageUrl = 'img/pieces/squirrel.png';
                this.tiles[randomY][randomX].player1ImageUrl = 'img/pieces/squirrel.png';
                this.tiles[randomY][randomX].player2ImageUrl = 'img/pieces/squirrel.png';
                this.critterTiles.push(this.tiles[randomY][randomX]);
                this.critterTileCoordinates.push(<Coordinate>{x: randomX, y: randomY});
                numCritters -= 1;
            }
        }
    }

    /**
     * Reset the critter tiles and re-select random critters.
     */
    public reset() {
        this.critterTiles.forEach((tile: Tile) => {
            tile.emptyImageUrl = "";
            tile.player1ImageUrl = "";
            tile.player2ImageUrl = "";
        });
        this.generateRandomCritterTiles();
        super.reset();
    }
}
