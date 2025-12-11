import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../common/service/api.service";
import { shared } from "../../app.config";
import { NotificationService } from "../../common/service/notification.service";
import { catchError } from "rxjs";

export const ROUTE_REGISTER = 'register';

@Component({
    selector: 'app-register',
    imports: [shared],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    form = new FormGroup({
        email: new FormControl<string>('', [Validators.email, Validators.required]),
        firstName: new FormControl<string>('', [Validators.required]),
        lastName: new FormControl<string>('', [Validators.required]),
        address: new FormControl<string>('', [Validators.required]),
        city: new FormControl<string>('', [Validators.required]),
        country: new FormControl<string>('', [Validators.required]),
        phone: new FormControl<string>('', [Validators.required])
    });

    constructor(
        private api: ApiService,
        private notificationService: NotificationService
    ) {
    }

    onSubmit() {
        const email = this.form.get('email')?.value;
        const password = 'Test1234';
        const firstName = this.form.get('firstName')?.value;
        const lastName = this.form.get('lastName')?.value;
        const address = this.form.get('address')?.value;
        const city = this.form.get('city')?.value;
        const country = this.form.get('country')?.value;
        const phone = this.form.get('phone')?.value;

        this.api.userApi.register({
            firstName: firstName as string,
            lastName: lastName as string,
            email: email as string,
            password: password,
            address: address as string,
            city: city as string,
            country: country as string,
            phone: phone as string
        }).pipe(
            catchError(error => this.notificationService.showError(error))
        ).subscribe((user) => {
            if (user) {
                this.notificationService.showSuccess('Successfully registered user.')
            }
        });
    }
}
