import { MonteCarlo } from "../mcts";
import { LevelFiveBoard } from "../../board/boards/boards";
import { Board, Coordinate } from "../../board/board";
import { States } from "../../tile/tile";

export class GiuseppeAi extends MonteCarlo {
    /**
     * Giuseppe has a very unique board where only critters count for points
     * therefore he uses a modified monte carlo to encourage him to try to
     * capture critters instead of just capturing the most tiles.
     *
     * Warning... this AI kinda sucks.
     */

    /** The coordinates of the critter tiles on the original board */
    private critterLocations: Array<Coordinate>;

    /** Try to make G pretty smart */
    public constructor() {
        super(490);
    }

    /**
     * Save the critter locations before continuing on with the make move method
     * @param {Board} board the game board to make a move on
     * @returns {Coordinate} the coordinate of the move the AI will make
     */
    public makeMove(board: Board): Coordinate | undefined {
        this.critterLocations = (<LevelFiveBoard>(
            board
        )).getCritterTileCoordinates();
        return super.makeMove(board);
    }

    /**
     * Gets the player 2 score considering that only critter tiles count
     * @param {Board} board the current game board to get the score for
     * @returns {number} the score
     */
    protected getPlayer2Score(board: Board): number {
        let score: number = 0;
        this.critterLocations.forEach((coord: Coordinate) => {
            if (board.tiles[coord.y][coord.x].state === States.PLAYER2) {
                score += 1;
            }
        });
        return score;
    }

    /**
     * Gets the player 1 score considering that only critter tiles count
     * @param {Board} board the current game board to get the score for
     * @returns {number} the score
     */
    protected getPlayer1Score(board: Board): number {
        let score: number = 0;
        this.critterLocations.forEach((coord: Coordinate) => {
            if (board.tiles[coord.y][coord.x].state === States.PLAYER1) {
                score += 1;
            }
        });
        return score;
    }
}
