/* tslint:disable */
// your lint rules are bad and i refuse to use them

import { Skynet } from './skynet';
import { Board, Coordinate } from '../board/board';
import { AIBoardState } from './skynet';
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
        // Get the board state
        const state: AIBoardState = this.dumpBoardState(board);
        
        // Generate layers for inserting into model
        const layers: Array<number> = this.generateLayersFromState(state, board.height);

        let action: number;
        while (true) {
            const testBoard = new Board();
            testBoard.width = board.width;
            testBoard.height = board.height;
            this.loadBoardState(state, testBoard);
            action = this.agent.act(layers);
            if (state.tiles[States.EMPTY].includes(action)) {
                break;
            } else {
                console.log("bad move, retrying...")
            }
        }
        const y = Math.floor(action / state.width);
        const x = action - (y * state.width);
        console.log(action, x, y);

        // make the move that had the most victories from random playouts
        return <Coordinate> {
            x: x,
            y: y
        };
    }

    private generateLayersFromState(state: AIBoardState, height: number): Array<number> {
        const playerOneLayer = new Array<number>();
        const playerTwoLayer = new Array<number>();
        const disabledLayer = new Array<number>();
        const emptyLayer = new Array<number>();
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < state.width; x++) {
                const i = y * state.width + x;
                playerOneLayer.push(state.tiles[States.PLAYER1].includes(i) ? 1 : 0)
                playerTwoLayer.push(state.tiles[States.PLAYER2].includes(i) ? 1 : 0)
                disabledLayer.push(state.tiles[States.DISABLED].includes(i) ? 1 : 0)
                emptyLayer.push(state.tiles[States.EMPTY].includes(i) ? 1 : 0)
            }
        }
        return playerOneLayer.concat(playerTwoLayer, disabledLayer, emptyLayer)
    }

    public reward(amount: number) {
        this.agent.learn(amount);
    }
}

