import { Board } from '../board/board';
import { NPC } from '../player/npcs';

/**
 * A class representing a level of SKG
 * @class
 */
export class Level {
    /** The level number */
    public number: number;
    /** The level name */
    public name: string;
    /** The level description */
    public description: string;
    /** The level NPC */
    public npc: NPC;
    /** The board that the level takes place on (defines rules and behavior) */
    public board: Board;

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
export namespace Levels {
    export const one: Level = new Level({
        number: 1,
        name: "Level 1",
        description: "Tutorial Level"
    });


    /**
     * Simple function to get a random level
     * @returns {Level}
     */
    export function random(): Level {
        const levels = [
        ];
        return levels[Math.floor(Math.random() * levels.length)];
    }
}
