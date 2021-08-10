/* tslint:disable */
// your lint rules are bad and i refuse to use them

import { Skynet } from './skynet';
import { Board, Coordinate } from '../board/board';
import { States } from '../tile/tile';
import './rl.js';

export class DQN extends Skynet {

    private agent: any;

    /** Allows different AIs to adjust how smart they are */
    public constructor(width: number, height: number) {
        super();
        const env = {
            getNumStates: () => { return width * height * 4 },
            getMaxNumActions: () => { return width * height }
        }
        const spec = {
            alpha: 0.01
        }
        this.agent = new RL.DQNAgent(env, spec);
    }

    /**
     * Takes in a board and determines what AI move to make
     * @param {Board} board the board to make a move on
     * @returns {Coordinate} the coordinate of the move the AI will make 
     */
    public makeMove (board: Board) : Coordinate | undefined {
        const possibleMoves = this.getPossibleMoves(board);
        
        return possibleMoves[0];
    }
}

