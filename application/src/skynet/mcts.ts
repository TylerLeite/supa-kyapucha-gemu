/* tslint:disable */
// your lint rules are bad and i refuse to use them

import { AIBoardState, Skynet } from './skynet';
import { Board, Coordinate } from '../board/board';
import { States } from '../tile/tile';

export class Node extends Board {

}

export class MonteCarlo extends Skynet {

    private Q: Map<string, number> = new Map<string, number>();
    private N: Map<string, number> = new Map<string, number>();
    private children: Map<string, Array<string>> = new Map<string, Array<string>>();
    private boardStates: Map<string, AIBoardState> = new Map<string, AIBoardState>();
    private explorationWeight = Math.sqrt(2)
    private lastNumPossibleMoves: number;
    private k = 1;

    public constructor(k=300) {
        super();
        this.k = k;
    }

    public makeMove(board: Board) {

        if (this.lastNumPossibleMoves !== undefined && this.getPossibleMoves(board).length > this.lastNumPossibleMoves) {
            this.Q = new Map<string, number>();
            this.N = new Map<string, number>();
            this.children = new Map<string, Array<string>>();
            this.boardStates = new Map<string, AIBoardState>();
        }
        this.lastNumPossibleMoves = this.getPossibleMoves(board).length;

        for (let i = 0; i < this.k; i++) {
            this.doRollout(board);
        }

        console.log("rollout complete");

        if (board.emptyCount === 0) {
            return
        }

        if (!this.children.has(board.boardHash)) {
            const possibleMoves = this.getPossibleMoves(board);
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
        }

        const bestBoardHash = (<Array<string>>this.children.get(board.boardHash)).reduce(
            (i, j) => {
                //return <number>this.N.get(i) > <number>this.N.get(j) ? i : j;
                return (<number>this.Q.get(i) / <number>this.N.get(i)) > (<number>this.Q.get(j) / <number>this.N.get(j)) ? i : j; 
            }
        )
        const bestBoard = this.newBoardFromState(<AIBoardState>this.boardStates.get(bestBoardHash));
        return bestBoard.lastMove;
    }

    public doRollout(board: Board) {
        const path = this.select(board);
        const leaf = path[path.length - 1];
        console.log("expanding leaf")
        this.expand(leaf);
        console.log("simulating leaf")
        const reward = this.simulate(leaf);
        console.log("rewarding path", reward)
        this.backPropagate(path, reward);
    }

    private expand(board: Board) {
        if (this.children.has(board.boardHash)) {
            return;
        } else {
            this.boardStates.set(board.boardHash, this.dumpBoardState(board));
            this.children.set(board.boardHash, new Array<string>());
            const boardState = this.dumpBoardState(board)
            const possibleMoves = this.getPossibleMoves(board);
            for (let move of possibleMoves) {
                const childBoard = this.newBoardFromState(boardState);
                childBoard.place(move.x, move.y);

                const children = <Array<string>>this.children.get(board.boardHash);
                children.push(childBoard.boardHash);
                this.children.set(board.boardHash, children);
                this.boardStates.set(childBoard.boardHash, this.dumpBoardState(childBoard));
            }
        }
    }

    private simulate(board: Board) {
        let turn = board.turn;
        while (true) {
            if (board.emptyCount === 0) {
                let reward = 0;
                console.log(turn, this.getPlayer1Score(board), this.getPlayer2Score(board))
                if (turn === States.PLAYER1) {
                    reward = 1 - (this.getPlayer1Score(board) / (this.getPlayer1Score(board) + this.getPlayer2Score(board)));
                } else if (turn === States.PLAYER2) {
                    reward = 1 - (this.getPlayer2Score(board) / (this.getPlayer1Score(board) + this.getPlayer2Score(board)));
                }
                return reward;
            } else {
                const possibleMoves = this.getPossibleMoves(board);
                const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
                const state = this.dumpBoardState(board);
                board = this.newBoardFromState(state);
                board.place(randomMove.x, randomMove.y)
            }
        }
    }

    private backPropagate(path: Array<Board>, reward: number) {
        for (let board of path.reverse()) {
            let n = this.N.get(board.boardHash);
            let q = this.Q.get(board.boardHash);
            n = n ? n + 1 : 1;
            q = q ? q + reward : reward;
            this.N.set(board.boardHash, n);
            this.Q.set(board.boardHash, q);
            reward = 1 - reward;
        }
    }

    private select(board: Board) {
        const path = new Array<Board>();
        while (true) {
            const state = this.dumpBoardState(board);
            path.push(this.newBoardFromState(state));
            if (!this.children.has(board.boardHash)) { 
                return path;
            }
            if (this.children.get(board.boardHash)?.length === 0) { 
                return path;
            }
            const unexplored = ((<Array<string>>this.children.get(board.boardHash)).filter(n => !this.children.has(n)))
            for(let boardHash of unexplored) {
                if (boardHash === board.boardHash) {
                    continue;
                }
                board = this.newBoardFromState(<AIBoardState>this.boardStates.get(boardHash))
                path.push(board);
                return path;
            }
            board = this.uctSelect(board);
        }
    }

    private uctSelect(board: Board) {
        const logNVertex = Math.log(<number>this.N.get(board.boardHash))
        const children = <Array<string>>this.children.get(board.boardHash);
        return this.newBoardFromState(<AIBoardState>this.boardStates.get(children.reduce(
            (i, j) => {
                return this.calculateUct(i, logNVertex) > this.calculateUct(j, logNVertex) ? i : j;
            }
        )))
    }

    private calculateUct(boardHash: string, logNVertex: number): number {
        return <number>this.Q.get(boardHash) / <number>this.N.get(boardHash) + this.explorationWeight * Math.sqrt(logNVertex / <number>this.N.get(boardHash))
    }

    /**
     * Gets the player 2 score
     * @param {Board} board the current game board to get the score for
     * @returns {number} the score
     */
    protected getPlayer2Score(board: Board): number {
        return board.player2Count;
    }

    /**
     * Gets the player 1 score
     * @param {Board} board the current game board to get the score for
     * @returns {number} the score
     */
    protected getPlayer1Score(board: Board): number {
        return board.player1Count;
    }
}

// export class MonteCarlo extends Skynet {

//     /** How many random playthroughs to do */
//     private k: number;

//     /** Allows different AIs to adjust how smart they are */
//     public constructor(k: number = 100) {
//         super();
//         this.k = k;
//     }

//     /**
//      * Takes in a board and determines what AI move to make
//      * @param {Board} board the board to make a move on
//      * @returns {Coordinate} the coordinate of the move the AI will make 
//      */
//     public makeMove (board: Board) : Coordinate | undefined {
//         const possibleMoves = this.getPossibleMoves(board);
//         const takeMoves = this.spliceTakeMoves(board, possibleMoves);
//         const safeMoves = this.spliceSafeMoves(board, possibleMoves);
        
//         let bestMoveIndex = 0;
//         let movesToCheck: Array<Coordinate> = safeMoves.concat(takeMoves);
//         if (movesToCheck.length === 0) {
//             movesToCheck = possibleMoves;
//         }
//         const weights: Array<number> = [];
//         for (let l = 0; l < movesToCheck.length; l++) { // l is for leaf
//             // make a new board + move list since we don't want to corrupt the original ones
//             let volatileBoard = new Board();
//             volatileBoard.width = board.width; volatileBoard.height = board.height;
//             let bs = this.dumpBoardState(board);
//             this.loadBoardState(bs, volatileBoard);

//             // make the chosen leaf move
//             volatileBoard.place(movesToCheck[l].x, movesToCheck[l].y);

//             weights[l] = 0;
//             const boardState = this.dumpBoardState(volatileBoard);

//             // run k random playouts, record who wins in each
//             for (let g = 0; g < this.k; g++) {
//                 this.loadBoardState(boardState, volatileBoard);
//                 const victor: States = this.randomPlayout(volatileBoard);
//                 if (victor === board.turn) {
//                     weights[l] += 1;
//                 }
//             }
//             if (weights[l] > weights[bestMoveIndex]) {
//                 console.log(weights[l]);
//                 bestMoveIndex = l;
//             }
//         }

//         // make the move that had the most victories from random playouts
//         return movesToCheck[bestMoveIndex];
//     }

//     /**
//      * Gets a list of safe moves from the board (ones with no enemy pieces by it)
//      * Prefers moves that have more safe tiles surrounding them
//      * @param {Board} board the board to look for safe moves on 
//      * @param {Array<Coordinate>} possibleMoves the list of all possible moves
//      * @returns {Array<Coordinate>} the list of safest moves 
//      */
//     protected spliceSafeMoves (board: Board, possibleMoves: Array<Coordinate>) : Array<Coordinate> {
//         let moves: Array<Coordinate> = [];
//         let safest = 0;

//         for (let m = possibleMoves.length - 1; m >= 0; m--) {
//             const x = possibleMoves[m].x;
//             const y = possibleMoves[m].y;

//             // check all adjacent tiles for disabled / out of bounds
//             let unplayableAdjacentTiles = 0;
//             for (let j = -1; j < 2; j++) {
//                 for (let i = -1; i < 2; i++) {
//                     if (
//                         y+j < 0 || y+j >= board.height 
//                         || x+i < 0 || x +i >= board.width
//                         || board.tiles[y+j][x+i].state === States.DISABLED
//                         || board.tiles[y+j][x+i].state === board.turn
//                     ) {
//                         unplayableAdjacentTiles += 1;
//                     }
//                 }
//             }

//             if (unplayableAdjacentTiles > safest) {
//                 safest = unplayableAdjacentTiles;
//                 moves = [];
//             }

//             if (unplayableAdjacentTiles == safest && unplayableAdjacentTiles > 0) {
//                 moves.push({x, y});
//                 possibleMoves.splice(m, 1);
//             }
//         }
//         return moves;
//     }

//     /**
//      * Gets a list of moves from the board that capture other pieces
//      * If getAll is passed as true it will get all of the capture moves but
//      * otherwise it will only return the move(s) that flip the most enemy tiles.
//      * @param {Board} board the board to look for take moves on
//      * @param {Array<Coordinate>} possibleMoves the list of all possible moves
//      * @param {boolean} getAll whether or not to get all of the moves (defaults to true)
//      * @returns {Array<Coordinate>} the list of take moves
//      */
//     protected spliceTakeMoves (board: Board, possibleMoves: Array<Coordinate>, getAll: boolean = true) : Array<Coordinate> {
//         let moves: Array<Coordinate> = [];
//         let rankingIndex: Array<number> = [];
//         let highestRank: number = 0;
//         for (let m = possibleMoves.length - 1; m >= 0; m--) {
//             const x = possibleMoves[m].x;
//             const y = possibleMoves[m].y;

//             // check all adjacent tiles for disabled / out of bounds
//             let rank = 0;
//             let causedFlip = 0;
//             for (let j = -1; j < 2; j++) {
//                 for (let i = -1; i < 2; i++) {
//                     if (i === 0 && j === 0) {
//                         continue;
//                     }
//                     if (getAll === false) {
//                         rank = rank + board.checkReversi(x, y, i, j, true);
//                     } else {
//                         causedFlip = board.checkReversi(x, y, i, j, true);
//                         if (causedFlip > 0) {
//                             moves.push(possibleMoves[m]);
//                             possibleMoves.splice(m, 1);
//                             break;
//                         }
//                     }
                    
//                 }
//                 if (causedFlip > 0) {
//                     break;
//                 }
//             }
//             // only keep the moves that flip the most tiles
//             if (rank > 0) {
//                 if (rank > highestRank) {
//                     highestRank = rank;
//                     rankingIndex = new Array<number>();
//                 }
//                 if (rank === highestRank) {
//                     rankingIndex.push(m);
//                 }
//             }
//         }
//         // splice out the moves in order from the possibleMoves array
//         // because we reversed through the array when checking the possibleMoves
//         // we should be able to splice these out in order
//         if (getAll === false) {
//             for (let i = 0; i < rankingIndex.length; i++) {
//                 moves.push(possibleMoves[rankingIndex[i]]);
//                 possibleMoves.splice(rankingIndex[i], 1);
//             }
//         }
//         return moves;
//     }

//     /**
//      * Determines player 1's score
//      * @param {Board} board the board to get the score for
//      * @returns {number} the score
//      */
//     protected getPlayer1Score(board: Board): number {
//         return board.player1Count;
//     }

//     /**
//      * Determines player 2's score
//      * @param {Board} board the board to get the score for
//      * @returns {number} the score
//      */
//     protected getPlayer2Score(board: Board): number {
//         return board.player2Count;
//     }

//     /** 
//      * Run a game with moves chosen at random. We can use a small optimization 
//      * here where we only calculate the possible moves once, since no new moves 
//      * are ever made possible and the only moves made impossible are the same 
//      * ones we randomly choose.
//      * @param {Board} board the board to randomly playout
//      * @returns {States} the winning state (p1 or p2)
//      */
//      protected randomPlayout (board: Board) : States {
//         let possibleMoves = this.getPossibleMoves(board)
//         // Step 1: make hella random moves
//         while (possibleMoves.length > 0) {
//             // get the next tier of moves from our simple heuristic
//             const takeMoves = this.spliceTakeMoves(board, possibleMoves, false);
//             let safeMoves: Array<Coordinate> = [];
//             let movesToCheck: Array<Coordinate> = [];
//             if (takeMoves.length > 0) {
//                 movesToCheck = takeMoves;
//             } else {
//                 safeMoves = this.spliceSafeMoves(board, possibleMoves);
//                 if (safeMoves.length > 0) {
//                     movesToCheck = safeMoves;
//                 } else {
//                     movesToCheck = possibleMoves;
//                 }
//             }

//             // make a random one until the array is empty
//             const choice = Math.floor(Math.random()*movesToCheck.length);
//             board.place(movesToCheck[choice].x, movesToCheck[choice].y); // make the move
//             movesToCheck.splice(choice, 1);
//             possibleMoves = possibleMoves.concat(safeMoves).concat(takeMoves);
//         }

//         // Step 2: check who won
//         const p1Score = this.getPlayer1Score(board);
//         const p2Score = this.getPlayer2Score(board);

//         if (p1Score > p2Score) {
//             return States.PLAYER1;
//         } else if (p2Score > p1Score) {
//             return States.PLAYER2;
//         }

//         // Else something went wrong
//         return States.EMPTY;
//     }
// }

