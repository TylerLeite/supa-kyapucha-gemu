/* tslint:disable */
// your lint rules are bad and i refuse to use them

import { Skynet } from '../skynet';
import { Board, Coordinate } from '../../board/board';

export class RockWithFaceAi extends Skynet {
    /**
     * Rock With Face completely randomly chooses tiles. RWF is RNG at its finest.
     * @param {Board} board the current game board 
     * @returns {Coordinate | undefined} returns the coordinate of the move or undefined if
     * there is no move possible 
     */
    public makeMove (board: Board) : Coordinate | undefined {
        const possibleMoves = this.getPossibleMoves(board);
        if (possibleMoves.length === 0) {
            return undefined;
        }
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
}
