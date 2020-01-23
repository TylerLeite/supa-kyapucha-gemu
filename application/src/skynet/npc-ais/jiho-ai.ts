import { MonteCarlo } from '../mcts';

export class JihoAi extends MonteCarlo {
    /**
     * Bill uses the Monte Carlo AI with a low k because he is low key bad.
     */
    public constructor() {
        super(400);
    }
}
