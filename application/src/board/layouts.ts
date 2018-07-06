import { Coordinate } from './board';
/* tslint:disable-next-line:no-namespace */
export namespace Layouts {
    /* tslint:disable-next-line:no-namespace */
    export namespace SevenBySeven {
        export const standard: Coordinate[] = [];
        export const cornersCenter: Coordinate[] = [
            {x: 0, y: 0},
            {x: 0, y: 6},
            {x: 6, y: 0},
            {x: 6, y: 6},
            {x: 3, y: 3}
        ];
    }
}
