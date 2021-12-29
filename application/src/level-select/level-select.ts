import { Level, Levels } from './levels';
import { LevelButton } from '../level-button/level-button';
import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';

@inject(Router)
export class LevelSelect {
    public levels: Level[] = Levels.levels;
    public router: Router;

    public constructor(router: Router) {
        this.router = router;
    }

    /**
     * The method called when a level button is clicked on... it makes
     * the button do a little jiggle and then navigates to the level.
     * @param levelButton the button that was clicked
     * @param level the level to navigate to 
     */
    public startLevel(levelButton: LevelButton, level: Level): void {
        levelButton.jello();
        // More animations?
        // Go to the level...
        setTimeout(() => {
            this.router.navigateToRoute('level', {id: level.number});
        })
    }
}
