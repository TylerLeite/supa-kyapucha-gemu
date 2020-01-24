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

    /**
     * Accepts a width, height, and number and returns that many randomly
     * blocked out coordinates.
     * @param {number} width the width of the board 
     * @param {number} height the height of the board
     * @param {number} numToBlock how many blocked out coordinates to return 
     */
    function randomBlockedTiles(width: number, height: number, numToBlock: number) {
        const blockedOutTiles: Array<Coordinate> = new Array<Coordinate>();
        const allTiles: Array<Coordinate> = new Array<Coordinate>();

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                allTiles.push({x: x, y: y});
            }
        }
        for (let i = 0; i < numToBlock; i++) {
            if (allTiles.length === 0) {
                break;
            }
            const index = Math.floor(Math.random() * allTiles.length);
            blockedOutTiles.push({x: allTiles[index].x, y: allTiles[index].y});
            allTiles.splice(index, 1);
        }
        return blockedOutTiles;
    }

    export const randomFour: Layout = new Layout({
        height: 7,
        width: 7,
        blockedOutTiles: randomBlockedTiles(7, 7, 4)
    });

    export const randomSix: Layout = new Layout({
        height: 7,
        width: 7,
        blockedOutTiles: randomBlockedTiles(7, 7, 6)
    });

    export const randomEight: Layout = new Layout({
        height: 7,
        width: 7,
        blockedOutTiles: randomBlockedTiles(7, 7, 8)
    });

    export const standard: Layout = new Layout({
        height: 7,
        width: 7,
        blockedOutTiles: []
    });

    export const large: Layout = new Layout({
        height: 9,
        width: 9,
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

    export const pillars: Layout = new Layout({
        height: 7,
        width: 7,
        blockedOutTiles: [
            {x: 1, y: 1},
            {x: 5, y: 1},
            {x: 5, y: 5},
            {x: 1, y: 5}
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
            tall,
            pillars,
            randomFour,
            randomSix,
            randomEight,
            large
        ];
        return layouts[Math.floor(Math.random() * layouts.length)];
    }
}
