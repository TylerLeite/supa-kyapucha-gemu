import { bindable, BindingEngine, inject } from 'aurelia-framework';
import * as textFit from 'textfit';

/**
 * The score class, displays a scoreboard
 * @class
 */
@inject(BindingEngine)
export class Score {
    /** Various bindable attributes to display in the score board */
    @bindable public player1Score: number = 0;
    @bindable public player2Score: number = 0;
    @bindable public player1Image: string = "img/char/yeshi.png";
    @bindable public player2Image: string = "img/char/bohyun.png";
    @bindable public player1Name: string = "test";
    @bindable public player2Name: string = "test";
    /** References to certain DOM elements */
    private player1ScoreRef: HTMLElement;
    private player2ScoreRef: HTMLElement;
    private player1NameRef: HTMLElement;
    private player2NameRef: HTMLElement;
    /** The text-fit configuration */
    private textFitConfig = {alignHoriz: true, alignVert: true, maxFontSize: 200, reProcess: true};
    private bindingEngine: BindingEngine;

    public constructor(bindingEngine: BindingEngine) {
        this.bindingEngine = bindingEngine;
    }

    /**
     * The aurelia attached lifecycle method, waits
     * for the DOM to appear and then resizes the text to 
     * fit the containers.
     */
    public attached() {
        /** Text fit certain elements */
        this.bindingEngine.propertyObserver(this, 'player1Score').subscribe(() => {
            textFit(this.player1ScoreRef, this.textFitConfig);
        });
        this.bindingEngine.propertyObserver(this, 'player2Score').subscribe(() => {
            textFit(this.player2ScoreRef, this.textFitConfig);
        });
        textFit([
            this.player1NameRef,
            this.player2NameRef,
            this.player1ScoreRef,
            this.player2ScoreRef
        ], this.textFitConfig);
    }
}
