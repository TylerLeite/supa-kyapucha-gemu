export class Player {
    public firstName: string;
    public lastName: string;
    public imageUrl: string;

    public get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    constructor(attrs) {
        if (attrs) {
            Object.assign(this, attrs);
        }
    }
}
