import { bindable, observable, LogManager } from 'aurelia-framework';
import { Tile, States } from '../../tile/tile';
import { Layout, Layouts } from '../layouts';
import { Board, Coordinate } from '../board';

const logger = LogManager.getLogger('tutorial-board');

/**
 * Class defining the gameboard and game logic
 * @class
 */
export class TutorialBoard extends Board {
    
    public layout: Layout = Layouts.mini;

}