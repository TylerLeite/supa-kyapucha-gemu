import { Board, Coordinate } from '../board/board';
import { Tile, States } from '../tile/tile';

/**
 * We will be storing a lot of board states, and actual Board objects take up a 
 * lot more memory than they need to. So we just store minimal states instead, 
 * and have functions to dump & load them
 */
export interface AIBoardState {
    width: number;
    tiles: {
        0: Array<number>, // player 1
        1: Array<number>, // player 2
        // EMPTY is implicit
        3: Array<number> // disabled
    };
    turn: States;
}

/**
 * The AI abstract class with a few helper functions that might
 * come in handy when writing an AI.
 */
export abstract class Skynet {
    /**
     * Determines what move the AI is going to make, accepts
     * a board as a parameter and returns the Coordinate of the
     * move or undefined if there are no possible moves.
     * @param { Board } board the current game board
     * @returns { Coordinate | undefined } a Coordinate of the
     * move the AI wants to make, or undefined if there are no
     * possible moves (or the AI doesn't want to move?)
     */
    abstract makeMove(board: Board): Coordinate | undefined;

    /**
     * Since you can place a piece on any empty square, the list of 
     * possible moves is the same as the list of empty squares. 
     * In variants, this function may need to change
     */
    protected getPossibleMoves(board: Board): Array<Coordinate> {
        const moves: Array<Coordinate> = [];
        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                if (board.tiles[y][x].state === States.EMPTY) {
                    moves.push({x, y});
                }
            }
        }
        return moves;
    }

    /**
     * Extract the type of each tile, board width, 
     * and current turn. This should be all you need
     * @param {Board} board the board to extract state from
     * @returns {AIBoardState} the board state
     */
    protected dumpBoardState(board: Board): AIBoardState {
        const state: AIBoardState = {
            width: 0,
            tiles: {
                0: [],
                1: [],
                3: []
            },
            turn: States.EMPTY
        };

        state.width = board.width;
        state.turn = board.turn;

        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                const tileType: States = board.tiles[y][x].state;
                if (tileType === States.EMPTY) {
                    continue; // idc about empty tiles, they suck
                }
                // we only really need 1 number to specify the position, if we also have the width
                const i = y * board.width + x;
                state.tiles[tileType].push(i);
            }
        }
        return state;
    }

    /**
     * A method to take a AIBoardState and load it back into
     * a board.
     * @param { AIBoardState } state the state to load into the board 
     * @param { Board } board the board to load the state into
     * @returns { Board } the loaded board
     */
    protected loadBoardState(state: AIBoardState, board: Board): Board {
        board.tiles = [];
        board.blockedOutTiles = [];
        board.turn = state.turn;
        for (let y = 0; y < board.height; y++) {
            board.tiles[y] = [];

            for (let x = 0; x < board.width; x++) {
                board.tiles[y][x] = new Tile();
                const i = y * board.width + x;
                if (state.tiles[0].includes(i)) {
                    board.tiles[y][x].state = States.PLAYER1;
                } else if (state.tiles[1].includes(i)) {
                    board.tiles[y][x].state = States.PLAYER2;
                } else if (state.tiles[3].includes(i)) {
                    // dont forget to add the tile to blockedOutTiles
                    board.blockedOutTiles.push({x, y});
                    board.tiles[y][x].state = States.DISABLED;
                } else {
                    board.tiles[y][x].state = States.EMPTY;
                }
            }
        }

        return board;
    }

    /**
     * Performs the same function as loadBoardState but creates
     * a new board in case you don't have one you want to load
     * the state into already.
     * @param { AIBoardState } state the state to load into the board
     * @returns { Board } the new board with the state loaded
     */
    protected newBoardFromState(state: AIBoardState): Board {
        const board: Board = new Board();
        return this.loadBoardState(state, board);
    }
}
