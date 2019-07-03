import { bindable, inject } from 'aurelia-framework';
import { Player } from '../player/player';
import { NPCs } from '../player/npcs';
import * as textFit from 'textfit';

/**
 * The score class, displays a scoreboard
 * @class
 */
@inject(NPCs)
export class Score {
    /** Various bindable attributes to display in the score board */
    @bindable public player1: Player = NPCs.random();
    @bindable public player2: Player = NPCs.random();
    @bindable public player1Score: number = 0;
    @bindable public player2Score: number = 0;
    /** References to certain DOM elements */
    private player1ScoreRef: HTMLElement;
    private player2ScoreRef: HTMLElement;
    private player1NameRef: HTMLElement;
    private player2NameRef: HTMLElement;
    /** The text-fit configuration */
    private textFitConfig = {alignVertWithFlexbox: true, alignHoriz: true, alignVert: true, maxFontSize: 200, reProcess: true};
    /** Whether or not the dom has loaded yet */
    private domLoaded: boolean = false;

    /**
     * Simple changed method triggered by changes to the player 1 score,
     * will re-fit the text depending on the score.
     */
    protected player1ScoreChanged(): void {
        if (this.domLoaded) {
            textFit(this.player1ScoreRef, this.textFitConfig);
        }
    }

    /**
     * Simple changed method triggered by changes to the player 2 score,
     * will re-fit the text depending on the score.
     */
    protected player2ScoreChanged(): void {
        if (this.domLoaded) {
            textFit(this.player2ScoreRef, this.textFitConfig);
        }
    }

    /**
     * The aurelia attached lifecycle method, waits
     * for the DOM to appear and then resizes the text to 
     * fit the containers.
     */
    public attached() {
        this.domLoaded = true;
        textFit([
            this.player1NameRef,
            this.player2NameRef,
            this.player1ScoreRef,
            this.player2ScoreRef
        ], this.textFitConfig);
    }
}
