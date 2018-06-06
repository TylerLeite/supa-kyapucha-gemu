import { LogManager } from 'aurelia-framework';

const logger = LogManager.getLogger('tile');

export class Tile {
    private state: States = States.EMPTY;
    public tileUi: HTMLElement;
    public tileFrontUi: HTMLElement;
    public tileBackUi: HTMLElement;

    private emptyColor = "grey";
    private player1Color = "red";
    private player2Color = "blue";

    private flipClass = 'is-flipped';



    public attached() {
        this.tileFrontUi.style.backgroundColor = this.emptyColor;
    }

    private flip() {
        this.tileUi.classList.toggle(this.flipClass);
    }

    private isFlipped() {
        return this.tileUi.classList.contains(this.flipClass);
    }

    public getState() {
        return this.state;
    }

    public setState(newState: States) {
        if (newState === this.state) {
            return;
        }
        if (this.state === States.EMPTY) {
            if (newState === States.PLAYER1) {
                this.tileFrontUi.style.backgroundColor = this.player1Color;
                this.tileBackUi.style.backgroundColor = this.player2Color;
            } else if (newState === States.PLAYER2) {
                this.tileFrontUi.style.backgroundColor = this.player2Color;
                this.tileBackUi.style.backgroundColor = this.player1Color;
            }
        } else {
            this.flip();
        }
        this.state = newState;
    }

    public reset() {
        this.state = States.EMPTY;
        this.tileFrontUi.style.backgroundColor = this.emptyColor;
        this.tileBackUi.style.backgroundColor = this.emptyColor;
        if (this.isFlipped()) {
            this.flip();
        }
    }
}

export enum States {
    PLAYER1,
    PLAYER2,
    EMPTY
}
