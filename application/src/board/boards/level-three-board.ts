import { LogManager, useView } from 'aurelia-framework';
import { States } from '../../tile/tile';
import { Layout, Layouts } from '../layouts';
import { AiBoard } from './ai-board';
import { isFunctionTypeNode } from 'typescript';

const logger = LogManager.getLogger('level-three-board');

@useView('../board.html')

/**
 * Class defining the gameboard and game logic for level 3
 * @class
 */
export class LevelThreeBoard extends AiBoard {

    /** The number of moves in a row the AI can make */
    private sequentialMoves: number = 5;
    /** Keeps track of how many moves in a row the AI has made */
    private doubleMoveCounter: number = 1;
    /** Standard layout to not freak out the player too much */
    public layout: Layout = Layouts.standard;

    /** 
     * When toggling turns, instead of swapping turns immediately,
     * compare against the doubleMoveCounter and see if the AI gets
     * another move
     */
    protected toggleTurn() {
        if (this.turn === States.PLAYER1) {
            this.turn = States.PLAYER2;
        } else {
            if (this.doubleMoveCounter < this.sequentialMoves) {
                this.doubleMoveCounter += 1;
            } else {
                this.turn = States.PLAYER1;
                this.doubleMoveCounter = 1;
            }
        }
    }

    /**
     * Stops from enabling the board while the AI is making
     * multiple moves in a row
     */
    public enable() {
        if (this.doubleMoveCounter !== 1) {
            return;
        }
        super.enable();
    }

    /**
     * Reset the doubleMoveCounter when the board resets
     */
    public reset(): void {
        this.doubleMoveCounter = 1;
        super.reset();
        this.layoutChanged();
    }
}
