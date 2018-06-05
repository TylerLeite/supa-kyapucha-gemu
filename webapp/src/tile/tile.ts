export class Tile {
    private state: TileStates = TileStates.EMPTY;
    public tileUi: HTMLElement;

    public flip() {
        this.tileUi.classList.toggle('is-flipped');
    }
}

export enum TileStates {
    PLAYER1,
    PLAYER2,
    EMPTY
}
