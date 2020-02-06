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

    /** Large layout that is going to be the field (9x9) */
    public layout: Layout = Layouts.large;
    /** An array of all of the mine tiles */
    private mineTiles: Array<Tile> = [];
    /** An array of the coordinates of the mine tiles */
    private mineTileCoordinates: Array<Coordinate>;
    /** 
     * The number of mines to generate each game... generally keeping this
     * close to the height/width of the board seems to work well 
     */
    private numMines: number = 10;
    /** How many mines can be flipped over before losing the game */
    private lives: number = 1;
    /** The number of times the player has won */
    private win: number = 0;
    /** The color of an empty tile */
    private emptyTileColor: string = "white";
    /** The color of a mine tile */
    private mineTileColor: string = "black";


    /**
     * Little bit hacky, but we need to generate the mine tiles
     * and reset the board after we generate the initial board so that
     * the mine tiles render correctly.  May revisit this to make it
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
     * Since many actions depend on there not being 0 tiles left
     * (such as resetting the board) this is overwritten to always
     * return the nubmer of lives until the player loses.
     * @returns {number} - number of empty tiles (player lives)
     */
    public get emptyCount(): number {
        return this.lives;
    }

    /**
     * Gets the number of wins by player 1.  A win counts
     * as flipping over all of the tiles except for mine tiles.
     * @returns {number} the number of wins by player 1
     */
    public get player1Count(): number {
        return this.win;
    }

    /**
     * Gets the number of tiles left to flip over with the exception of mine tiles
     * essentially the number of tiles left to flip to win the game.
     * @returns {number} number of tiles left to flip
     */
    public get player2Count(): number {
        const count: number = this.getCountOfType(States.PLAYER2) - this.numMines;
        if (this.lives === 0 || count < 0) {
            return 0;
        }
        return count;
    }

    /**
     * Method to color a tile based on the number of mines that neighbor the tile
     * NOTE: This only colors tiles with up to 5 neighbors... we could always add 6,7,8 but
     * that's very rare.
     * @param {number} x the x coordinate of the tile to check
     * @param {number} y the y coordinate of the tile to check
     */
    private colorNeighbors(x: number, y: number) {
        /** iterate through neighbor tiles */
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0 || y + j < 0 || x + i < 0
                    || y + j >= this.layout.height || x + i >= this.layout.width) {
                    continue;
                }
                const neighborTile: Tile = this.tiles[y + j][x + i];
                /** increase the danger level color of the tile if the neighbor is a mine */
                switch (neighborTile.player1Color) {
                    case this.emptyTileColor: {
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
     * Generates random mine tiles on the board
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
                this.tiles[randomY][randomX].player1Color = this.mineTileColor;
                this.mineTiles.push(this.tiles[randomY][randomX]);
                this.mineTileCoordinates.push(<Coordinate>{x: randomX, y: randomY});
                this.colorNeighbors(randomX, randomY);
                numMines -= 1;
            }
        }
    }

    /**
     * Determines whether or not to flip tiles surrounding the tile selected
     * by the user.  In this game, if the user selects a tile that does not
     * neighbor any mine tiles, it will flip all of its non-mine neighbor tiles
     * recursively.
     * @param {number} x the x coordinate of the tile we are checking 
     * @param {number} y the y coordinate of the tile we are checking
     */
    private flipSquares(x: number, y: number) {
        /** Flip appropriate tiles */
        const currentTile: Tile = this.tiles[y][x];
        if (currentTile.state !== States.PLAYER2) {
            return;
        }
        if (currentTile.player1Color !== this.emptyTileColor) {
            if (currentTile.player1Color !== this.mineTileColor) {
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
                if (neighborTile.state === States.PLAYER1 || neighborTile.player1Color === this.mineTileColor) {
                    continue;
                } else {
                    this.flipSquares(x + i, y + j);
                }
            }
        }
    }


    /** 
     * Place a tile on a particular coordinate on the board
     * @param {number} x the x coordinate of the tile to place
     * @param {number} y the y coordinate of the tile to place
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

        /** If the tile is a mine, end the game */
        if (this.tiles[y][x].player1Color === this.mineTileColor) {
            this.tiles[y][x].state = this.turn;
            this.finishGame();
            return true;
        } else {
            this.flipSquares(x, y);
        }

        /** If the player has flipped all non-mine tiles, they win! */
        if (this.player2Count === 0) {
            this.win += 1;
            this.finishGame();
        }

        return true;
    }

    /**
     * Complete the game by flipping over all of the tiles and setting the
     * number of lives to 0 (causing the empty count to be zero)
     */
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

    /**
     * Flips all of the tiles to the player2 side, hiding the mine side
     */
    private hideMines() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.tiles[i][j].state = States.PLAYER2;
            }
        }
    }

    /** Reset the board flip all tiles and regenerate mines and colors */
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
                    this.tiles[i][j].player1Color = this.emptyTileColor;
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
