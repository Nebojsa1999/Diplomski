import { Component } from '@angular/core';
import { shared } from "../app.config";
import { AuthenticationService } from "../common/service/authentication.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_SIGN_IN } from "./profile-feature/login/login.component";
import { Role } from "../rest/user/user.model";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-main-component',
    imports: [shared],
    templateUrl: './main-component.component.html',
    styleUrl: './main-component.component.scss',
})
export class MainComponentComponent {

    currentUser = toSignal(this.authService.activeUser);

    constructor(public authService: AuthenticationService, private router: Router, private route: ActivatedRoute) {
    }

    logout() {
        this.authService.logout();
        this.router.navigate([ROUTE_SIGN_IN], {relativeTo: this.route});
    }

   Role = Role;
}