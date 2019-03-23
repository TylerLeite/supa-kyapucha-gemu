import { Board } from '../board/board';
import * as Boards from '../board/boards/boards';
import { NPC, NPCs } from '../player/npcs';

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
    export const zero: Level = new Level({
        number: 0,
        name: "Tutorial",
        description: "Tutorial Level",
        npc: NPCs.bohyun,
        board: Boards.TutorialBoard
    });

    export const one: Level = new Level({
        number: 1,
        name: "Level 1",
        description: "",
        npc: NPCs.rockWithFace,
        board: Boards.LevelOneBoard
    });

    export const two: Level = new Level({
        number: 1,
        name: "Level 2",
        description: "",
        npc: NPCs.bill,
        board: undefined
    });

    export const three: Level = new Level({
        number: 3,
        name: "Level 3",
        description: "",
        npc: NPCs.rockWithFace,
        board: undefined
    });

    export const four: Level = new Level({
        number: 4,
        name: "Level 4",
        description: "",
        npc: NPCs.bill,
        board: undefined
    });

    export const five: Level = new Level({
        number: 5,
        name: "Level 5",
        description: "",
        npc: NPCs.jiho,
        board: undefined
    });

    export const six: Level = new Level({
        number: 6,
        name: "Level 6",
        description: "",
        npc: NPCs.kanako,
        board: undefined
    });

    export const seven: Level = new Level({
        number: 7,
        name: "Level 7",
        description: "",
        npc: NPCs.margaret,
        board: undefined
    });

    export const eight: Level = new Level({
        number: 8,
        name: "Level 8",
        description: "",
        npc: NPCs.kanako,
        board: undefined
    });

    export const nine: Level = new Level({
        number: 9,
        name: "Level 9",
        description: "",
        npc: NPCs.margaret,
        board: undefined
    });

    export const ten: Level = new Level({
        number: 10,
        name: "Level 10",
        description: "",
        npc: NPCs.giuseppe,
        board: undefined
    });

    export const eleven: Level = new Level({
        number: 11,
        name: "Level 11",
        description: "",
        npc: NPCs.olga,
        board: undefined
    });

    export const twelve: Level = new Level({
        number: 12,
        name: "Level 12",
        description: "",
        npc: NPCs.kent,
        board: undefined
    });

    export const thirteen: Level = new Level({
        number: 13,
        name: "Level 13",
        description: "",
        npc: NPCs.olga,
        board: undefined
    });

    export const fourteen: Level = new Level({
        number: 14,
        name: "Level 14",
        description: "",
        npc: NPCs.kent,
        board: undefined
    });

    export const fifteen: Level = new Level({
        number: 15,
        name: "Level 15",
        description: "",
        npc: NPCs.giuseppe,
        board: undefined
    });

    /** A list of all the levels */
    export const levels = [
        zero,
        one,
        two,
        three,
        four,
        five,
        six,
        seven,
        eight,
        nine,
        ten,
        eleven,
        twelve,
        thirteen,
        fourteen,
        fifteen
    ];

    /**
     * Simple function to get a random level
     * @returns {Level}
     */
    export function random(): Level {
        return levels[Math.floor(Math.random() * levels.length)];
    }
}