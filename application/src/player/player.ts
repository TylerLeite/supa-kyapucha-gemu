/**
 * A class representing a player
 * @class
 */
export class Player {
    /** The first name of the player */
    public firstName: string;
    /** The last name of the player */
    public lastName: string;
    /** A path to the image the player is using ie: img/char/bill.png */
    public imageUrl: string;
    /** The full name of the player (first + last) */
    public get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    /**
     * Takes the passed in attrs and assigns them to the Player object
     * @constructor
     * @param {any} attrs attributes to assign to the player
     */
    constructor(attrs: any) {
        if (attrs) {
            Object.assign(this, attrs);
        }
    }
}
