import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';

@inject(Router)
export class Home {
    private router: Router;

    public constructor(router: Router) {
        this.router = router;
    }
}
