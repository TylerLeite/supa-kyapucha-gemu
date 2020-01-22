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
