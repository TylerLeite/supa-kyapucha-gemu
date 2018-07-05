import { Board } from '../board/board';
import { Layouts } from '../board/layouts';

export class Local {
    /** The game board being used */
    public board: Board;

    public attached() {
        this.board.disableTiles(Layouts.SevenBySeven.cornersCenter);
    }
}
