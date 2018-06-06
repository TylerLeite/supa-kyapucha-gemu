import { bindable, LogManager } from 'aurelia-framework';
import { Tile, States } from '../tile/tile';

const logger = LogManager.getLogger('board');

export class Board {
    @bindable public height: number;
    @bindable public width: number;
    public tiles: Array<Tile>[] = new Array<Tile[]>();
    private turn: States = States.PLAYER1;

    public bind() {
        for (let i = 0; i < this.height; i++) {
            this.tiles.push(new Array<any>(this.width));
        }
    }

    public place(x: number, y: number) {
        if (this.tiles[y][x].getState() !== States.EMPTY) {
            return;
        }

        this.tiles[y][x].setState(this.turn);

        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                this.checkReversi(x, y, i, j);
            }
        }

        if (this.turn === States.PLAYER1) {
            this.turn = States.PLAYER2;
        } else {
            this.turn = States.PLAYER1;
        }
    }

    public reset() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; i++) {
                this.tiles[i][j].reset();
            }
        }
    }

    public inBounds(x, y) {
        if (x >= this.width || x < 0) {
            return false;
        }
        if (y >= this.height || y < 0) {
            return false;
        }
        return true;
    }

    public checkReversi(sx, sy, xdir, ydir) {
        const nx = sx + xdir;
        const ny = sy + ydir;

        if (!this.inBounds(nx, ny)) {
            return false;
        } else if (this.tiles[ny][nx].getState() === States.EMPTY) {
            return false;
        } else if (this.tiles[ny][nx].getState() === this.turn) {
            if (this.tiles[sy][sx].getState() !== this.turn) {
                this.tiles[sy][sx].setState(this.turn); // Comment this out if just checking
            }
            return true;
        } else {
            if (this.checkReversi(nx, ny, xdir, ydir)) {
                if (this.tiles[sy][sx].getState() !== this.turn) {
                    this.tiles[sy][sx].setState(this.turn); // Comment this out if just checking
                }
                return true;
            } else {
                return false;
            }
        }
    };
}
