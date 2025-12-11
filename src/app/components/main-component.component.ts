import { Component } from '@angular/core';
import { shared } from "../app.config";
import { AuthenticationService } from "../common/service/authentication.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_SIGN_IN } from "./login/login.component";

@Component({
    selector: 'app-main-component',
    imports: [shared],
    templateUrl: './main-component.component.html',
    styleUrl: './main-component.component.scss',
})
export class MainComponentComponent {

    constructor(private authService: AuthenticationService, private router: Router, private route: ActivatedRoute) {
    }

    logout() {
        this.authService.logout();
        this.router.navigate([ROUTE_SIGN_IN], {relativeTo: this.route});
    }
}