import { LogManager, useView } from 'aurelia-framework';
// import { Tile, States } from '../../tile/tile';
import { Layout, Layouts } from '../layouts';
import { AiBoard } from './ai-board';

const logger = LogManager.getLogger('level-one-board');

@useView('../board.html')

/**
 * Class defining the gameboard and game logic for level 1
 * @class
 */
export class LevelOneBoard extends AiBoard {

    // Small layout for level one... mainly to get the player comfortable with
    // the basic mechanics before we absolutely destroy them later.
    public layout: Layout = Layouts.mini;

}
