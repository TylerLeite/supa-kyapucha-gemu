/* tslint:disable */
// your lint rules are bad and i refuse to use them

import { Skynet } from './skynet';
import { Board, Coordinate } from '../board/board';
import { States } from '../tile/tile';

export class MonteCarlo extends Skynet {

    private k: number = 100;

    public makeMove (board: Board) : Coordinate | undefined {
        const possibleMoves = this.getPossibleMoves(board);
        const safeMoves = this.spliceSafeMoves(board, possibleMoves);
        const takeMoves = this.spliceTakeMoves(board, possibleMoves);
        const movesToCheck: Array<Coordinate> = safeMoves.concat(takeMoves);
        const weights: Array<number> = [];
        for (let l = 0; l < movesToCheck.length; l++) { // l is for leaf
            // make a new board + move list since we don't want to corrupt the original ones
            let volatileBoard = new Board();
            volatileBoard.width = board.width; volatileBoard.height = board.height;
            let bs = this.dumpBoardState(board);
            this.loadBoardState(bs, volatileBoard);

            // make the chosen leaf move
            volatileBoard.place(movesToCheck[l].x, movesToCheck[l].y);
            let newSafeMoves = movesToCheck.slice();
            newSafeMoves.splice(l, 1);

            weights[l] = 0;
            const boardState = this.dumpBoardState(volatileBoard);

            // run k random playouts, record who wins in each
            for (let g = 0; g < this.k; g++) {
                this.loadBoardState(boardState, volatileBoard);
                const victor: States = this.randomPlayout(volatileBoard);
                if (victor == board.turn) {
                    weights[l] += 1;
                }
            }
        }

        // make the move that had the most victories from random playouts
        let bestMoveIndex = 0;
        for (let i = 1; i < weights.length; i++) {
            if (weights[i] > weights[bestMoveIndex]) {
                bestMoveIndex = i;
            }
        }

        return movesToCheck[bestMoveIndex];
    }

    private spliceSafeMoves (board: Board, possibleMoves: Array<Coordinate>) : Array<Coordinate> {
        let moves: Array<Coordinate> = [];
        let toSplice: Array<number> = [];
        let safest = 0;

        for (let m = 0; m < possibleMoves.length; m++) {
            const x = possibleMoves[m].x;
            const y = possibleMoves[m].y;

            // check all adjacent tiles for disabled / out of bounds
            let unplayableAdjacentTiles = 0;
            for (let j = -1; j < 2; j++) {
                for (let i = -1; i < 2; i++) {
                    if (
                        y+j < 0 || y+j >= board.height 
                        || x+i < 0 || x +i >= board.width
                        || board.tiles[y+j][x+i].state == States.DISABLED
                    ) {
                        unplayableAdjacentTiles += 1;
                    }
                }
            }

            if (unplayableAdjacentTiles > safest) {
                safest = unplayableAdjacentTiles;
                moves = [];
                toSplice = [];
            }

            if (unplayableAdjacentTiles == safest) {
                moves.push({x, y});
                toSplice.push(m);
            }
        }

        for (let s = toSplice.length-1; s >= 0; s--) {
            possibleMoves.splice(toSplice[s], 1);
        }

        return moves;
    }

    private spliceTakeMoves (board: Board, possibleMoves: Array<Coordinate>) : Array<Coordinate> {
        let moves: Array<Coordinate> = [];
        let toSplice: Array<number> = [];

        for (let m = 0; m < possibleMoves.length; m++) {
            const x = possibleMoves[m].x;
            const y = possibleMoves[m].y;

            // check all adjacent tiles for disabled / out of bounds
            let broken = false;
            for (let j = -1; j < 2; j++) {
                if (broken) break;
                for (let i = -1; i < 2; i++) {
                    if (i === 0 && j === 0) {
                        continue;
                    }
                    broken = board.checkReversi(x, y, i, j, true) === false;

                    if (!broken) {
                        moves.push({x, y});
                        toSplice.push(m);
                        break;
                    }
                }
            }
        }

        for (let s = toSplice.length-1; s >= 0; s--) {
            possibleMoves.splice(toSplice[s], 1);
        }

        return moves;
    }

    // Run a game with moves chosen at random. We can use a small optimization here where we only calculate the possible moves once, since no new moves are ever made possible and the only moves made impossible are the same ones we randomly choose.
    private randomPlayout (board: Board) : States {
        let possibleMoves = this.getPossibleMoves(board)
        // Step 1: make hella random moves
        while (possibleMoves.length > 0) {
            // get the next tier of moves from our simple heuristic
            const safeMoves = this.spliceSafeMoves(board, possibleMoves);
            const takeMoves = this.spliceTakeMoves(board, possibleMoves);
            let movesToCheck: Array<Coordinate> = [];
            if (safeMoves.length > 0) {
                movesToCheck = safeMoves;
            } else if (takeMoves.length > 0) {
                movesToCheck = takeMoves;
            } else {
                movesToCheck = possibleMoves;
            }

            // make a random one until the array is empty
            const choice = Math.floor(Math.random()*movesToCheck.length);
            board.place(movesToCheck[choice].x, movesToCheck[choice].y); // make the move
            possibleMoves = this.getPossibleMoves(board);
        }

        // Step 2: check who won
        const p1Score = board.player1Count;
        const p2Score = board.player2Count;

        if (p1Score > p2Score) {
            return States.PLAYER1;
        } else if (p2Score > p1Score) {
            return States.PLAYER2;
        }

        // Else something went wrong
        return States.EMPTY;
    }
}

