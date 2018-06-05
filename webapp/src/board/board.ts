import { bindable, LogManager } from 'aurelia-framework';
import { Tile } from '../tile/tile';

const logger = LogManager.getLogger('board');

export class Board {
    @bindable public height: number;
    @bindable public width: number;
    public tiles: Array<Tile>[] = new Array<Tile[]>();

    bind() {
        logger.debug(this.width.toString(), this.height, this.tiles);
        for (let i = 0; i < this.height; i++) {
            this.tiles.push(new Array<any>(this.width));
        }
    }

    place(x: number, y: number) {
        this.tiles[x][y].flip();
    }
}
