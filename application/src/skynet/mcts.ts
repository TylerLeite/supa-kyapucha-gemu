/* tslint:disable */
// your lint rules are bad and i refuse to use them

import { Skynet } from './skynet';
import { Board, Coordinate } from '../board/board';
import { States } from '../tile/tile';

export class MonteCarlo extends Skynet {

    private k: number;

    public constructor(k: number = 100) {
        super();
        this.k = k;
    }

    public makeMove (board: Board) : Coordinate | undefined {
        const possibleMoves = this.getPossibleMoves(board);
        const takeMoves = this.spliceTakeMoves(board, possibleMoves);
        const safeMoves = this.spliceSafeMoves(board, possibleMoves);
        
        let bestMoveIndex = 0;
        let movesToCheck: Array<Coordinate> = safeMoves.concat(takeMoves);
        if (movesToCheck.length === 0) {
            movesToCheck = possibleMoves;
        }
        const weights: Array<number> = [];
        for (let l = 0; l < movesToCheck.length; l++) { // l is for leaf
            // make a new board + move list since we don't want to corrupt the original ones
            let volatileBoard = new Board();
            volatileBoard.width = board.width; volatileBoard.height = board.height;
            let bs = this.dumpBoardState(board);
            this.loadBoardState(bs, volatileBoard);

            // make the chosen leaf move
            volatileBoard.place(movesToCheck[l].x, movesToCheck[l].y);

            weights[l] = 0;
            const boardState = this.dumpBoardState(volatileBoard);

            // run k random playouts, record who wins in each
            for (let g = 0; g < this.k; g++) {
                this.loadBoardState(boardState, volatileBoard);
                const victor: States = this.randomPlayout(volatileBoard);
                if (victor === board.turn) {
                    weights[l] += 1;
                }
            }
            if (weights[l] > weights[bestMoveIndex]) {
                console.log(weights[l]);
                bestMoveIndex = l;
            }
        }

        // make the move that had the most victories from random playouts
        return movesToCheck[bestMoveIndex];
    }

    protected spliceSafeMoves (board: Board, possibleMoves: Array<Coordinate>) : Array<Coordinate> {
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
                        y+j < 0 || y+j >= board.height 
                        || x+i < 0 || x +i >= board.width
                        || board.tiles[y+j][x+i].state === States.DISABLED
                        || board.tiles[y+j][x+i].state === board.turn
                    ) {
                        unplayableAdjacentTiles += 1;
                    }
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

    protected spliceTakeMoves (board: Board, possibleMoves: Array<Coordinate>, getAll: boolean = true) : Array<Coordinate> {
        let moves: Array<Coordinate> = [];
        let rankingIndex: Array<number> = [];
        let highestRank: number = 0;
        for (let m = possibleMoves.length - 1; m >= 0; m--) {
            const x = possibleMoves[m].x;
            const y = possibleMoves[m].y;

            // check all adjacent tiles for disabled / out of bounds
            let rank = 0;
            let causedFlip = 0;
            for (let j = -1; j < 2; j++) {
                for (let i = -1; i < 2; i++) {
                    if (i === 0 && j === 0) {
                        continue;
                    }
                    if (getAll === false) {
                        rank = rank + board.checkReversi(x, y, i, j, true);
                    } else {
                        causedFlip = board.checkReversi(x, y, i, j, true);
                        if (causedFlip > 0) {
                            moves.push(possibleMoves[m]);
                            possibleMoves.splice(m, 1);
                            break;
                        }
                    }
                    
                }
                if (causedFlip > 0) {
                    break;
                }
            }
            // only keep the moves that flip the most tiles
            if (rank > 0) {
                if (rank > highestRank) {
                    highestRank = rank;
                    rankingIndex = new Array<number>();
                }
                if (rank === highestRank) {
                    rankingIndex.push(m);
                }
            }
        }
        // splice out the moves in order from the possibleMoves array
        // because we reversed through the array when checking the possibleMoves
        // we should be able to splice these out in order
        if (getAll === false) {
            for (let i = 0; i < rankingIndex.length; i++) {
                moves.push(possibleMoves[rankingIndex[i]]);
                possibleMoves.splice(rankingIndex[i], 1);
            }
        }
        return moves;
    }

    protected getPlayer1Score(board: Board): number {
        return board.player1Count;
    }

    protected getPlayer2Score(board: Board): number {
        return board.player2Count;
    }

    // Run a game with moves chosen at random. We can use a small optimization here where we only calculate the possible moves once, since no new moves are ever made possible and the only moves made impossible are the same ones we randomly choose.
    protected randomPlayout (board: Board) : States {
        let possibleMoves = this.getPossibleMoves(board)
        // Step 1: make hella random moves
        while (possibleMoves.length > 0) {
            // get the next tier of moves from our simple heuristic
            const takeMoves = this.spliceTakeMoves(board, possibleMoves, false);
            let safeMoves: Array<Coordinate> = [];
            let movesToCheck: Array<Coordinate> = [];
            if (takeMoves.length > 0) {
                movesToCheck = takeMoves;
            } else {
                safeMoves = this.spliceSafeMoves(board, possibleMoves);
                if (safeMoves.length > 0) {
                    movesToCheck = safeMoves;
                } else {
                    movesToCheck = possibleMoves;
                }
            }

            // make a random one until the array is empty
            const choice = Math.floor(Math.random()*movesToCheck.length);
            board.place(movesToCheck[choice].x, movesToCheck[choice].y); // make the move
            movesToCheck.splice(choice, 1);
            possibleMoves = possibleMoves.concat(safeMoves).concat(takeMoves);
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
}

