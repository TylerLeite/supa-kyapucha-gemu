import { LogManager } from 'aurelia-framework';
import { RouterConfiguration } from 'aurelia-router';

const logger = LogManager.getLogger('app');

export class App {
    configureRouter(config: RouterConfiguration): void {
        logger.debug("configuring the router");
        config.title = "SKG";
        config.map([
            { route: ['', 'home'], name: 'home', moduleId: 'home/home' },
            { route: 'online', name: 'online', moduleId: 'online/online' },
            { route: 'local', name: 'local', moduleId: 'local/local' },
            { route: 'adventure', name: 'adventure', moduleId: 'adventure/adventure' },
            { route: 'skynet', name: 'skynet', moduleId: 'aigame/aigame' }
        ]);
        config.mapUnknownRoutes('home/home');
    }
}
