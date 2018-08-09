import { Coordinate } from './board';

/**
 * A class representing a layout of a board
 * @class
 */
export class Layout {
    /** The height of the board */
    public height: number;
    /** The width of the board */
    public width: number;
    /** A list of coordinates to block out on the board */
    public blockedOutTiles: Coordinate[];

    /**
     * Takes the passed in attrs and assigns them to the Layout object
     * @constructor
     * @param {any} attrs attributes to assign to the layout
     */
    constructor(attrs: any) {
        if (attrs) {
            Object.assign(this, attrs);
        }
    }
}

/* tslint:disable-next-line:no-namespace */
export namespace Layouts {
    export const standard: Layout = new Layout({
        height: 7,
        width: 7,
        blockedOutTiles: []
    });

    export const cornersCenter: Layout = new Layout({
        height: 7,
        width: 7,
        blockedOutTiles: [
            {x: 0, y: 0},
            {x: 0, y: 6},
            {x: 6, y: 0},
            {x: 6, y: 6},
            {x: 3, y: 3}
        ]
    });

    export const mini: Layout = new Layout({
        height: 5,
        width: 5,
        blockedOutTiles: []
    });

    export const diamond: Layout = new Layout({
        height: 7,
        width: 7,
        blockedOutTiles: [
            {x: 0, y: 3},
            {x: 1, y: 4},
            {x: 1, y: 2},
            {x: 2, y: 5},
            {x: 2, y: 1},
            {x: 3, y: 6},
            {x: 3, y: 0},
            {x: 4, y: 5},
            {x: 4, y: 1},
            {x: 5, y: 4},
            {x: 5, y: 2},
            {x: 6, y: 3}
        ]
    });

    export const plus: Layout = new Layout({
        height: 7,
        width: 7,
        blockedOutTiles: [
            {x: 0, y: 3},
            {x: 2, y: 3},
            {x: 3, y: 6},
            {x: 3, y: 4},
            {x: 3, y: 2},
            {x: 3, y: 0},
            {x: 4, y: 3},
            {x: 6, y: 3}
        ]
    });

    export const tall: Layout = new Layout({
        height: 7,
        width: 5,
        blockedOutTiles: []
    });

    /**
     * Simple function to get a random board layout
     * @returns {Layout}
     */
    export function random(): Layout {
        const layouts = [
            standard,
            cornersCenter,
            mini,
            diamond,
            plus,
            tall
        ];
        return layouts[Math.floor(Math.random() * layouts.length)];
    }
}
