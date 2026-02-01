import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from "../../../common/service/api.service";
import { shared } from "../../../app.config";
import { catchError, of } from "rxjs";
import { AuthenticationService } from "../../../common/service/authentication.service";
import { SignInResponse } from "../../../rest/authentication/authentication.model";
import { map } from "rxjs/operators";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NotificationService } from "../../../common/service/notification.service";

export const ROUTE_SIGN_IN = 'sign-in';

@Component({
    selector: 'app-login',
    imports: [shared],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    form = new FormGroup({
        email: new FormControl<string>('', [Validators.required, Validators.email]),
        password: new FormControl<string>('', [Validators.required]),
    });

    constructor(
        private router: Router,
        private apiService: ApiService,
        private notificationService: NotificationService,
        private authService: AuthenticationService
    ) {
        authService.activeUser.pipe(
            takeUntilDestroyed()
        ).subscribe(() => {
            this.router.navigate(['../..']);
        })
    }

    submit() {
        const username = this.form.get('email')?.value;
        const password = this.form.get('password')?.value;

        this.apiService.authenticationApi.emailSignIn({
            username: username as string,
            password: password as string
        }).pipe(
            map((response) => response.data),
            catchError(err => {
                this.notificationService.showError(err)
                return of(null);
            })
        ).subscribe((response: SignInResponse | null) => {
            if (!response) {
                return;
            }

            this.authService.setAuthentication(response);
        })
    }
}
