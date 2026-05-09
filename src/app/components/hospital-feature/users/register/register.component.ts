import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../common/service/api.service";
import { shared } from "../../../../app.config";
import { NotificationService } from "../../../../common/service/notification.service";
import { catchError, of } from "rxjs";
import { Gender, Role } from "../../../../rest/user/user.model";
import { map } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_USERS } from "../list-users/list-users.component";
import { DoctorType } from "../../../../rest/hospital/hospital.model";
import { ROUTE_SIGN_IN } from "../../../profile-feature/login/login.component";

export const ROUTE_REGISTER = 'register';
export const ROUTE_ADD_USER = 'add-user';

@Component({
    selector: 'app-register',
    imports: [shared],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    patientOnly = this.route.snapshot.data['patientOnly'] === true;

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
        role: new FormControl<Role | null>(this.patientOnly ? Role.PATIENT : null, [Validators.required]),
        doctorType: new FormControl<DoctorType | null>(null),
        hospital: new FormControl<number | null>(null, this.patientOnly ? [] : [Validators.required])
    });

    genders = Object.values(Gender);
    roles = Object.values(Role).filter(role => role != Role.ADMIN_SYSTEM);
    doctorTypes = Object.values(DoctorType)
    Role = Role;

    hospitals$ = this.api.hospitalApi.list().pipe(
        map(response => response.data),
        catchError(error => of([]))
    )

    constructor(
        private api: ApiService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private location: Location
    ) {
    }

    goBack() { this.location.back(); }

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
        const doctorType = this.form.get('doctorType')?.value;

        const payload = {
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
            hospitalId: hospitalId as number,
            doctorType: doctorType as DoctorType
        };

        const request$ = this.patientOnly
            ? this.api.userApi.publicRegister(payload)
            : this.api.userApi.register(payload);

        request$.pipe(
            catchError(error => this.notificationService.showError(error))
        ).subscribe((user) => {
            if (user) {
                this.notificationService.showSuccess('Successfully registered user.');
                if (this.patientOnly) {
                    this.router.navigate([ROUTE_SIGN_IN]);
                } else {
                    this.router.navigate([ROUTE_USERS]);
                }
            }
        });
    }
}
