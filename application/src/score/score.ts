import { bindable } from 'aurelia-framework';
import * as textFit from 'textfit';

export class Score {
    @bindable public player1Score: number = 0;
    @bindable public player2Score: number = 0;
    @bindable public player1Image: string = "img/char/yeshi.png";
    @bindable public player2Image: string = "img/char/bohyun.png";
    @bindable public player1Name: string = "test";
    @bindable public player2Name: string = "test";

    private player1ScoreRef: HTMLElement;
    // private player2ScoreRef: HTMLElement;
    // private player1NameRef: HTMLElement;
    // private player2NameRef: HTMLElement;

    public attached() {
        textFit(this.player1ScoreRef);
    }
}
