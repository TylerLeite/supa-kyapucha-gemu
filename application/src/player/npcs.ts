import { Player } from './player';

/**
 * A class representing an NPC
 * @class
 * @extends Player
 */
class NPC extends Player {
    /** A short and sweet statement describing the character */
    public about: string;

    /**
     * Calls super which assigns the passed in attrs to the object
     * @constructor
     * @param {any} attrs attributes to assign to the npc
     */
    constructor(attrs: any) {
        super(attrs);
    }

    // FIXME: We probably want some character lines for different situations
    // FIXME: Do we want to store some sort of AI in here?
}

/**
 * A namespace containing all of the NPCs in the game
 */
/* tslint:disable-next-line:no-namespace */
export namespace NPCs {
    export const bill: NPC = new NPC({
        firstName: 'Bill',
        lastName: 'Smith',
        imageUrl: 'img/char/bill.png',
        about: 'Something about Bill'
    });
    export const bohyun: NPC = new NPC({
        firstName: 'Bohyun',
        lastName: 'Kim',
        imageUrl: 'img/char/bohyun.png',
        about: 'Something about Bohyun'
    });
    export const giuseppe: NPC = new NPC({
        firstName: 'Giuseppe',
        lastName: 'De Luca',
        imageUrl: 'img/char/giuseppe.png',
        about: 'Something about Giuseppe'
    });
    export const jiho: NPC = new NPC({
        firstName: 'Jiho',
        lastName: 'Lee',
        imageUrl: 'img/char/jiho.png',
        about: 'Something about Jiho'
    });
    export const kanako: NPC = new NPC({
        firstName: 'Kanako',
        lastName: 'Yokoyama',
        imageUrl: 'img/char/kanako.png',
        about: 'Something about Kanako'
    });
    export const kent: NPC = new NPC({
        firstName: 'Kent',
        lastName: 'Borg',
        imageUrl: 'img/char/kent.png',
        about: 'Something about Kent'
    });
    export const margaret: NPC = new NPC({
        firstName: 'Margaret',
        lastName: 'Winchester',
        imageUrl: 'img/char/margaret.png',
        about: 'Something about Margaret'
    });
    export const olga: NPC = new NPC({
        firstName: 'Olga',
        lastName: 'Stheno',
        imageUrl: 'img/char/olga.png',
        about: 'Something about Olga'
    });
    export const rockWithFace: NPC = new NPC({
        firstName: 'Rock',
        lastName: 'With Face',
        imageUrl: 'img/char/rock_with_face.png',
        about: 'Something about Rock With Face'
    });
    export const yeshi: NPC = new NPC({
        firstName: 'Yeshi',
        lastName: 'Kaw',
        imageUrl: 'img/char/yeshi.png',
        about: 'Something about Yeshi'
    });

    /**
     * Simple function to get a random NPC
     * @returns {NPC}
     */
    export function random(): NPC {
        const characters = [
            bill,
            bohyun,
            giuseppe,
            jiho,
            kanako,
            kent,
            margaret,
            olga,
            rockWithFace,
            yeshi
        ];
        return characters[Math.floor(Math.random() * characters.length)];
    }
}
