import { LogManager, useView } from "aurelia-framework";
import { States, Tile } from "../../tile/tile";
import { Coordinate } from "../board";
import { LevelFiveBoard } from "./level-five-board";
import { Layout, Layouts } from "../layouts";

const logger = LogManager.getLogger("level-five-board");

@useView("../board.html")

/**
 * Class defining the gameboard and game logic for level 5
 * @class
 */
export class LevelEightBoard extends LevelFiveBoard {
    /** The total number of critters to generate */
    protected numCritters: number = 7;

    public layout: Layout = JSON.parse(JSON.stringify(Layouts.fences));

    /**
     * Places a tile.  After a tile is placed, randomly move some of the critters
     * @param x the x coordinate
     * @param y the y coordinate
     * @param isAI whether or not it is the AI moving
     */
    public place(x: number, y: number, isAI: boolean = false): boolean {
        const value: boolean = super.place(x, y, isAI);
        if (value) {
            const newCritterTileCoordinates = new Array<Coordinate>();
            const newCritterTiles = new Array<Tile>();
            this.critterTileCoordinates.forEach((coord: Coordinate) => {
                // We just try moving the squirrel once, if the squirrel happens to roll
                // 0 movement, or rolls a move to a invalid square, just skip over it
                const xMovement = coord.x + (Math.floor(Math.random() * 3) - 1);
                const yMovement = coord.y + (Math.floor(Math.random() * 3) - 1);
                let moved = false;
                if (this.inBounds(xMovement, yMovement)) {
                    if (
                        this.tiles[yMovement][xMovement].emptyImageUrl !==
                            "img/pieces/squirrel.png" &&
                        this.tiles[yMovement][xMovement].state !==
                            States.DISABLED
                    ) {
                        this.changeTilePiece(coord.x, coord.y, "");
                        this.changeTilePiece(
                            xMovement,
                            yMovement,
                            "img/pieces/squirrel.png"
                        );
                        newCritterTileCoordinates.push(<Coordinate>{
                            x: xMovement,
                            y: yMovement,
                        });
                        newCritterTiles.push(this.tiles[yMovement][xMovement]);
                        moved = true;
                    }
                }
                // If the critter didn't move, re-record it's coordinates in the
                // new array
                if (!moved) {
                    newCritterTileCoordinates.push(<Coordinate>{
                        x: coord.x,
                        y: coord.y,
                    });
                    newCritterTiles.push(this.tiles[coord.y][coord.x]);
                }
            });
            this.critterTileCoordinates = newCritterTileCoordinates;
            this.critterTiles = newCritterTiles;
        }
        return value;
    }
}
