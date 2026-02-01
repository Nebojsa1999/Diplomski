import { Component, effect } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { ApiService } from "../../../common/service/api.service";
import { shared } from "../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../../common/service/authentication.service";
import { NotificationService } from "../../../common/service/notification.service";
import { catchError } from "rxjs";
import { map } from "rxjs/operators";

export const ROUTE_CHANGE_PASSWORD = 'change-password';

@Component({
    selector: 'app-change-password',
    imports: [shared],
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
    currentUser = toSignal(this.authService.activeUser);
    form = new FormGroup({
        password: new FormControl<string | null>(null)
    });

    constructor(
        private apiService: ApiService,
        private authService: AuthenticationService,
        private notificationService: NotificationService
    ) {
    }

    onSubmit() {
        if (this.form.valid) {
            const password = this.form.get('password')?.value;
            this.apiService.userApi.changePassword({
                password: password as string
            }).pipe(
                map(response => response.data),
                catchError(error => this.notificationService.showError(error.message))
            ).subscribe((response) => {
                if (response) {
                    this.notificationService.showSuccess("Successfully updated password.")
                }
            })
        }
    }

}
