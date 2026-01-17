import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../common/service/api.service";
import { shared } from "../../../../app.config";
import { NotificationService } from "../../../../common/service/notification.service";
import { catchError, of } from "rxjs";
import { Gender, Role } from "../../../../rest/user/user.model";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { ROUTE_USERS } from "../list-users/list-users.component";

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
        phone: new FormControl<string>('', [Validators.required]),
        gender: new FormControl<Gender | null>(null, [Validators.required]),
        personalId: new FormControl<string>('', [Validators.required]),
        occupation: new FormControl<string>('', [Validators.required]),
        occupationInfo: new FormControl<string>('', [Validators.required]),
        role: new FormControl<Role | null>(null, [Validators.required]),
        hospital: new FormControl<number | null>(null, [Validators.required])
    });

    genders = Object.values(Gender);
    roles = Object.values(Role).filter(role => role != Role.ADMIN_SYSTEM);
    hospitals$ = this.api.hospitalApi.list().pipe(
        map(response => response.data),
        catchError(error => of([]))
    )

    constructor(
        private api: ApiService,
        private router: Router,
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
        const personalId = this.form.get('personalId')?.value;
        const occupation = this.form.get('occupation')?.value;
        const occupationInfo = this.form.get('occupationInfo')?.value;
        const gender = this.form.get('gender')?.value;
        const role = this.form.get('role')?.value;
        const hospitalId = this.form.get('hospital')?.value;

        this.api.userApi.register({
            firstName: firstName as string,
            lastName: lastName as string,
            email: email as string,
            password: password,
            address: address as string,
            city: city as string,
            country: country as string,
            phone: phone as string,
            personalId: personalId as string,
            occupation: occupation as string,
            occupationInfo: occupationInfo as string,
            gender: gender as Gender,
            role: role as Role,
            hospitalId: hospitalId as number
        }).pipe(
            catchError(error => this.notificationService.showError(error))
        ).subscribe((user) => {
            if (user) {
                this.notificationService.showSuccess('Successfully registered user.');
                this.router.navigate([ROUTE_USERS]);
            }
        });
    }
}
