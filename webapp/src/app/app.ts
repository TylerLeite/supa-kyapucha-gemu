import { LogManager } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';

const logger = LogManager.getLogger('app');

export class App {
    private router: Router;

    configureRouter(config: RouterConfiguration, router: Router): void {
        logger.debug("configuring the router");
        this.router = router;
        config.title = "SKG";
        config.map([
            { route: ['', 'home'], name: 'home', moduleId: 'home/home' },
            { route: 'online', name: 'online', moduleId: 'online/online' },
            { route: 'local', name: 'local', moduleId: 'local/local' },
            { route: 'adventure', name: 'adventure', moduleId: 'adventure/adventure' }
        ]);
        config.mapUnknownRoutes('home/home');
    }
}
