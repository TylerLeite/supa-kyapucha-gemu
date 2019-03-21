/* tslint:disable */

import { Board } from '../board/board';
import { Tile, States } from '../tile/tile';

// We will be storing a lot of board states, and actual Board objects take up a lot more memory than they need to. So we just store minimal states instead, and have functions to dump & load them
export type BoardState = {
  width: number,
  tiles: {
    0: Array<number>, // player 1
    1: Array<number>, // player 2
    // EMPTY is implicit
    3: Array<number>, // disabled
  },
  turn: States,
}

// Extract the type of each tile, board width, and current turn. This should be al you need;
export function dumpBoardState (board: Board) : BoardState {
  let state: BoardState = {
    width: 0,
    tiles: {0: [], 1:[], 3: []},
    turn:States.EMPTY
  };

  state.width = board.width;
  state.turn = board.turn;

  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      const tileType: States = board.tiles[y][x].state;
      if (tileType == States.EMPTY) {
        continue; // idc about empty tiles, they suck
      }

      // we only really need 1 number to specify the position, if we also have the width
      const i = y*board.width + x;
      state.tiles[tileType].push(i);
    }
  }

  return state;
}

export function loadBoardState (state: BoardState, board: Board) : Board {
  board.tiles = [];
  board.blockedOutTiles = [];

  for (let y = 0; y < board.height; y++) {
    board.tiles[y] = [];

    for (let x = 0; x < board.width; x++) {
      board.tiles[y][x] = new Tile();
      const i = y*board.width + x;
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

export function newBoardFromState (state: BoardState) : Board {
  const board: Board = new Board();
  return loadBoardState(state, board);
}
