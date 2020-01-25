import { LogManager, useView } from 'aurelia-framework';
import { Tile, States } from '../../tile/tile';
import { Layout, Layouts } from '../layouts';
import { Coordinate } from '../board';
import { AiBoard } from './ai-board';

const logger = LogManager.getLogger('level-seven-board');

@useView('../board.html')

/**
 * Class defining the gameboard and game logic for level 6
 * @class
 */
export class LevelSevenBoard extends AiBoard {

    /**
     * Large layout that is going to be the field
     */
    public layout: Layout = Layouts.large;

    private mineTiles: Array<Tile> = [];

    private mineTileCoordinates: Array<Coordinate>;

    private numMines: number = 10;

    private lives: number = 1;

    private win: number = 0;

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
     * Get the number of empty tiles on the board
     * @returns {number} - number of empty tiles
     */
    public get emptyCount(): number {
        return this.lives;
    }

    public get player1Count(): number {
        return this.win;
    }

    public get player2Count(): number {
        const count: number = this.getCountOfType(States.PLAYER2) - this.numMines;
        if (this.lives === 0 || count < 0) {
            return 0;
        }
        return count;
    }


    /**
     * Gets a random integer between 0 and the specified max.
     * @param {number} max the maximum integer for the random number generated\
     * @returns {number} a random number between 0 and max
     */
    private getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }


    private colorNeighbors(x: number, y: number) {
        /** Flip appropriate tiles */
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0 || y + j < 0 || x + i < 0
                    || y + j >= this.layout.height || x + i >= this.layout.width) {
                    continue;
                }
                const neighborTile: Tile = this.tiles[y + j][x + i];
                console.log(neighborTile.player1Color);
                switch (neighborTile.player1Color) {
                    case 'white': {
                        neighborTile.player1Color = 'yellow';
                        break;
                    }
                    case 'yellow': {
                        neighborTile.player1Color = 'orange';
                        break;
                    }
                    case 'orange': {
                        neighborTile.player1Color = 'red';
                        break;
                    }
                    case 'red': {
                        neighborTile.player1Color = 'purple';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
    }


    /**
     * Generates random critter tiles on the board
     */
    private generateRandomMineTiles() {
        this.mineTiles = [];
        this.mineTileCoordinates = [];
        let numMines: number = this.numMines;
        while (numMines > 0) {
            const randomX = this.getRandomInt(this.layout.width);
            const randomY = this.getRandomInt(this.layout.height);
            if (this.tiles[randomY][randomX].player1ImageUrl !== 'img/pieces/mine.png') {
                this.tiles[randomY][randomX].player1ImageUrl = 'img/pieces/mine.png';
                this.tiles[randomY][randomX].player1Color = 'black';
                this.mineTiles.push(this.tiles[randomY][randomX]);
                this.mineTileCoordinates.push(<Coordinate>{x: randomX, y: randomY});
                this.colorNeighbors(randomX, randomY);
                numMines -= 1;
            }
        }
    }


    private flipSquares(x: number, y: number) {
        /** Flip appropriate tiles */
        const currentTile: Tile = this.tiles[y][x];
        if (currentTile.state !== States.PLAYER2) {
            return;
        }
        if (currentTile.player1Color !== "white") {
            if (currentTile.player1Color !== "black") {
                currentTile.state = States.PLAYER1;
            }
            return;
        }
        currentTile.state = States.PLAYER1;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0 || y + j < 0 || x + i < 0
                    || y + j >= this.layout.height || x + i >= this.layout.width) {
                    continue;
                }
                const neighborTile: Tile = this.tiles[y + j][x + i];
                if (neighborTile.state === States.PLAYER1 || neighborTile.player1Color === 'black') {
                    continue;
                } else {
                    this.flipSquares(x + i, y + j);
                }
            }
        }
    }


    /** 
     * Place a tile on a particular coordinate on the board
     * @returns {boolean} true if placement succeeded, false otherwise
     */
    public place(x: number, y: number): boolean {
        logger.debug(`Placing a piece at ${x}, ${y} for player ${this.turn}`);
        /** Check if placement is valid */
        if (this.tiles[y][x].state !== States.PLAYER2 || !this.inBounds(x, y)) {
            return false;
        }

        /** Update other stats */
        this.lastMove = {x: x, y: y};

        /** Set the tile to the current player */

        if (this.tiles[y][x].player1Color === 'black') {
            this.tiles[y][x].state = this.turn;
            this.finishGame();
            return true;
        } else {
            this.flipSquares(x, y);
        }

        if (this.player2Count === 0) {
            this.win += 1;
            this.finishGame();
        }

        return true;
    }

    private finishGame() {
        setTimeout(() => {
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    this.tiles[i][j].state = States.PLAYER1;
                }
            }
            setTimeout(() => {
                this.lives = 0;
            }, 3000);
        }, 1000);
    }

    private hideMines() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.tiles[i][j].state = States.PLAYER2;
            }
        }
    }


    /** Reset the board (set all tiles to empty) */
    public reset() {
        logger.debug("Resetting the board");
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.tiles[i][j].reset();
            }
        }
        setTimeout(() => {
            this.lives = 1;
            this.boardHidden = true;
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    this.tiles[i][j].player1Color = "white";
                    this.tiles[i][j].player1ImageUrl = "";
                    this.tiles[i][j].player2ImageUrl = "img/pieces/question_mark.png";
                }
            }
            this.generateRandomMineTiles();
            this.layoutChanged();
            setTimeout(() => {
                this.hideMines();
                setTimeout(() => {
                    this.boardHidden = false;
                });
            });
        });
    }
}
