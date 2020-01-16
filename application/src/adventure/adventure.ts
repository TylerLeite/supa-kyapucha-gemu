import { LogManager } from 'aurelia-framework';
import { RouterConfiguration } from 'aurelia-router';

const logger = LogManager.getLogger('adventure');

export class Adventure {
    configureRouter(config: RouterConfiguration): void {
        logger.debug("configuring the router");
        config.title = "SKG - Adventure";
        config.map([
            { route: '', redirect: 'level-select' },
            { route: 'level-select', name: 'level-select', moduleId: 'level-select/level-select' },
            { route: 'level/:id', name: 'level', moduleId: 'level-game/level-game' }
        ]);
        config.mapUnknownRoutes('level-select/level-select');
    }
}
