import { LogManager, useView } from 'aurelia-framework';
// import { Tile, States } from '../../tile/tile';
import { Layout, Layouts } from '../layouts';
import { AiBoard } from './ai-board';

const logger = LogManager.getLogger('level-two-board');

@useView('../board.html')

/**
 * Class defining the gameboard and game logic for level 2
 * @class
 */
export class LevelTwoBoard extends AiBoard {

    // Throw a weird layout at the user to confuse them.
    // Probably won't be very effective but you never know.
    public layout: Layout = Layouts.plus;

}
