import { LogManager, useView } from 'aurelia-framework';
import { States } from '../../tile/tile';
import { Layout, Layouts } from '../layouts';
import { AiBoard } from './ai-board';
import { isFunctionTypeNode } from 'typescript';

const logger = LogManager.getLogger('level-one-board');

@useView('../board.html')

/**
 * Class defining the gameboard and game logic
 * @class
 */
export class LevelThreeBoard extends AiBoard {

    private doubleMoveCounter: number = 1;

    public layout: Layout = Layouts.standard;


    protected toggleTurn() {
        if (this.turn === States.PLAYER1) {
            this.turn = States.PLAYER2;
        } else {
            if (this.doubleMoveCounter < 5) {
                this.doubleMoveCounter += 1;
            } else {
                this.turn = States.PLAYER1;
                this.doubleMoveCounter = 1;
            }
        }
    }

    public enable() {
        if (this.doubleMoveCounter !== 1) {
            return;
        }
        super.enable();
    }

    public reset(): void {
        this.doubleMoveCounter = 1;
        super.reset();
        this.layoutChanged();
    }
}
