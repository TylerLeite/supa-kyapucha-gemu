import { LogManager, useView } from 'aurelia-framework';
import { Tile, States } from '../../tile/tile';
import { Layout, Layouts } from '../layouts';
import { Coordinate } from '../board';
import { AiBoard } from './ai-board';

const logger = LogManager.getLogger('level-one-board');

@useView('../board.html')

/**
 * Class defining the gameboard and game logic
 * @class
 */
export class LevelFiveBoard extends AiBoard {

    public layout: Layout = JSON.parse(JSON.stringify(Layouts.standard));

    public constructor() {
        super();
    }

    private critterTiles: Array<Tile> = [];
    private critterTileCoordinates: Array<Coordinate> = [];

    public attached(): void {
        //tslint:disable-next-line
        if (this.boardUi === undefined) {
            // This is a hack until I can figure out how to pass the board reference in
            this.boardUi = <HTMLElement>document.getElementsByClassName("board")[0];
        }
        this.layoutChanged();
        setTimeout(() => {
            this.generateRandomCritterTiles();
            this.reset();
        });
    }

    /**
     * Get the number of tiles of a certain type (state)
     * @param {State} type - the type of tile to count
     * @returns {number} number of tiles of the type
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

    private getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    public getCritterTileCoordinates(): Array<Coordinate> {
        return this.critterTileCoordinates;
    }

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

    private generateRandomCritterTiles() {
        let numCritters: number = 7;
        this.critterTiles = [];
        this.critterTileCoordinates = [];
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
}
