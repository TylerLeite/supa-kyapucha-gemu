import { LogManager } from 'aurelia-framework';
import { RouterConfiguration } from 'aurelia-router';

const logger = LogManager.getLogger('adventure');

export class Adventure {
    configureRouter(config: RouterConfiguration): void {
        logger.debug("configuring the router");
        config.title = "SKG - Adventure";
        config.map([
            { route: '', redirect: 'levels' },
            { route: 'levels', name: 'levels', moduleId: 'levels/levels' }
        ]);
        config.mapUnknownRoutes('levels/levels');
    }
}
