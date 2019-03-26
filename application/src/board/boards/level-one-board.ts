import { LogManager, useView } from 'aurelia-framework';
// import { Tile, States } from '../../tile/tile';
import { Layout, Layouts } from '../layouts';
import { AiBoard } from './ai-board';

const logger = LogManager.getLogger('level-one-board');

@useView('../board.html')

/**
 * Class defining the gameboard and game logic
 * @class
 */
export class LevelOneBoard extends AiBoard {

    public layout: Layout = Layouts.mini;

}
