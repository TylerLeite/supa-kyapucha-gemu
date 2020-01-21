import { MonteCarlo } from '../mcts';
import { LevelFiveBoard } from '../../board/boards/boards';
import { Board, Coordinate } from '../../board/board';
import { Tile, States } from '../../tile/tile';

export class GiuseppeAi extends MonteCarlo {
    /**
     * Bill uses the Monte Carlo AI with a low k because he is low key bad.
     */

    private originalBoard: Board;

    private critterLocations: Array<Coordinate>;

    public constructor() {
        super(500);
    }

    public makeMove(board: Board): Coordinate | undefined {
        this.originalBoard = board;
        this.critterLocations = (<LevelFiveBoard>this.originalBoard).getCritterTileCoordinates();
        return super.makeMove(board);
    }

    protected spliceSafeMoves(board: Board, possibleMoves: Array<Coordinate>): Array<Coordinate> {
        let moves: Array<Coordinate> = [];
        let safest = 0;

        for (let m = possibleMoves.length - 1; m >= 0; m--) {
            const x = possibleMoves[m].x;
            const y = possibleMoves[m].y;

            // check all adjacent tiles for disabled / out of bounds
            let unplayableAdjacentTiles = 0;
            for (let j = -1; j < 2; j++) {
                for (let i = -1; i < 2; i++) {
                    if (
                        y + j < 0 || y + j >= board.height
                        || x + i < 0 || x + i >= board.width
                        || board.tiles[y + j][x + i].state === States.DISABLED
                        || board.tiles[y + j][x + i].state === board.turn
                    ) {
                        unplayableAdjacentTiles += 1;
                    }
                }
            }

            for (let i = 0; i < this.critterLocations.length; i++) {
                if (this.critterLocations[i].x === x && this.critterLocations[i].y === y) {
                    unplayableAdjacentTiles += 2;
                    break;
                }
                if (this.critterLocations[i].x === x || this.critterLocations[i].y === y) {
                    unplayableAdjacentTiles += 1;
                    break;
                }
            }

            if (unplayableAdjacentTiles > safest) {
                safest = unplayableAdjacentTiles;
                moves = [];
            }

            if (unplayableAdjacentTiles == safest && unplayableAdjacentTiles > 0) {
                moves.push({x, y});
                possibleMoves.splice(m, 1);
            }
        }
        return moves;
    }

    protected randomPlayout(board: Board): States {
        let possibleMoves = this.getPossibleMoves(board);
        // Step 1: make hella random moves
        while (possibleMoves.length > 0) {
            // get the next tier of moves from our simple heuristic
            const takeMoves = this.spliceTakeMoves(board, possibleMoves, true);
            const safeMoves = this.spliceSafeMoves(board, possibleMoves);
            let movesToCheck = takeMoves.concat(safeMoves);
            if (movesToCheck.length === 0) {
                movesToCheck = possibleMoves;
            }
            // make a random one until the array is empty
            const choice = Math.floor(Math.random() * movesToCheck.length);
            board.place(movesToCheck[choice].x, movesToCheck[choice].y); // make the move
            movesToCheck.splice(choice, 1);
            if (takeMoves.length > 0) {
                possibleMoves = possibleMoves.concat(movesToCheck);
            }
        }

        // Step 2: check who won
        const p1Score = this.getPlayer1Score(board);
        const p2Score = this.getPlayer2Score(board);

        if (p1Score > p2Score) {
            return States.PLAYER1;
        } else if (p2Score > p1Score) {
            return States.PLAYER2;
        }

        // Else something went wrong
        return States.EMPTY;
    }

    protected getPlayer2Score(board: Board) {
        let score: number = 0;
        this.critterLocations.forEach((coord: Coordinate) => {
            if (board.tiles[coord.y][coord.x].state === States.PLAYER2) {
                score += 1;
            }
        });
        return score;
    }


    protected getPlayer1Score(board: Board) {
        let score: number = 0;
        this.critterLocations.forEach((coord: Coordinate) => {
            if (board.tiles[coord.y][coord.x].state === States.PLAYER1) {
                score += 1;
            }
        });
        return score;
    }
}
