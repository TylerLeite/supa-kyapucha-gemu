import { MonteCarlo } from '../mcts';
import { Board, Coordinate } from '../../board/board';

export class BillAi extends MonteCarlo {
    /**
     * Bill uses the Monte Carlo AI with a low k because he is low key bad.
     */

    private randomizerOn: boolean = true;

    public constructor() {
        super(10);
    }

    public makeMove(board: Board): Coordinate | undefined {
        if (this.randomizerOn) {
            const randomizer = Math.random();
            if (randomizer < 0.5) {
                const possibleMoves = this.getPossibleMoves(board);
                return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
            }
        }
        return super.makeMove(board);
    }

    public changeRandomness(randomOn: boolean) {
        this.randomizerOn = randomOn;
    }
}
