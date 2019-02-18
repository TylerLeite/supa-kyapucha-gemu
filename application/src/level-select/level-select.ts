import { Level, Levels } from './levels';
import { LevelButton } from '../level-button/level-button';

export class LevelSelect {
    public levels: Level[] = Levels.levels;

    public startLevel(levelButton: LevelButton): void {
        levelButton.jello();
        // More animations?
        // Go to the level...
    }
}
