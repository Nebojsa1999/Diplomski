import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../common/service/api.service";
import { shared } from "../../../../app.config";
import { NotificationService } from "../../../../common/service/notification.service";
import { catchError, of, startWith, switchMap } from "rxjs";
import { Gender, Role } from "../../../../rest/user/user.model";
import { map } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_USERS } from "../list-users/list-users.component";
import { ROUTE_SIGN_IN } from "../../../profile-feature/login/login.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export const ROUTE_REGISTER = 'register';
export const ROUTE_CREATE_USER = 'create-user';

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
        role: new FormControl<Role | null>(this.patientOnly ? Role.PATIENT : Role.DOCTOR, [Validators.required]),
        doctorType: new FormControl<string | null>(null, this.patientOnly ? [] : [Validators.required]),
        hospital: new FormControl<number | null>(
            this.route.snapshot.queryParams['hospitalId'] ? +this.route.snapshot.queryParams['hospitalId'] : null,
            this.patientOnly ? [] : [Validators.required]
        )
    });

    genders = Object.values(Gender);
    roles = Object.values(Role).filter(role => role == Role.DOCTOR);
    Role = Role;

    hospitals$ = this.api.hospitalApi.list().pipe(
        map(response => response.data),
        catchError(error => of([]))
    )
    doctorTypes$ = this.form.get('hospital')!.valueChanges.pipe(
        startWith(this.form.get('hospital')!.value),
        takeUntilDestroyed(),
        switchMap(hospitalId => hospitalId
            ? this.api.hospitalApi.listDepartments(undefined, hospitalId).pipe(
                map(response => response.data),
                catchError(() => of([]))
              )
            : of([])
        )
    )

    constructor(
        private api: ApiService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private location: Location
    ) {
        this.form.get('role')?.valueChanges.pipe(
            takeUntilDestroyed()
        ).subscribe((role) => {
            const hospital = this.form.get('hospital');
            const doctorType = this.form.get('doctorType');

            if (role === Role.PATIENT) {
                hospital?.clearValidators();
                doctorType?.clearValidators();
            } else if (role === Role.DOCTOR) {
                hospital?.setValidators([Validators.required]);
                doctorType?.setValidators([Validators.required]);
            }

            hospital?.updateValueAndValidity();
            doctorType?.updateValueAndValidity();
        });
    }

    goBack() {
        this.location.back();
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
        const gender = this.form.get('gender')?.value;
        const role = this.form.get('role')?.value;
        const hospitalId = this.form.get('hospital')?.value;
        const selectedDepartment = this.form.get('doctorType')?.value as any;
        const departmentId: number | undefined = selectedDepartment?.id ?? undefined;

        const registerCall = this.patientOnly ? this.api.userApi.register.bind(this.api.userApi) : this.api.userApi.addUser.bind(this.api.userApi);
        registerCall({
            firstName: firstName as string,
            lastName: lastName as string,
            email: email as string,
            password: password,
            address: address as string,
            city: city as string,
            country: country as string,
            phone: phone as string,
            personalId: personalId as string,
            gender: gender as Gender,
            role: role as Role,
            hospitalId: hospitalId as number,
            departmentId
        }).pipe(
            catchError(error => this.notificationService.showError(error))
        ).subscribe((user) => {
            if (user) {
                this.notificationService.showSuccess('Successfully registered user.');
                if (this.patientOnly) {
                    this.router.navigate([ROUTE_SIGN_IN]);
                } else {
                    this.router.navigate([ROUTE_USERS], { queryParams: { hospitalId } });
                }
            }
        });
    }
}
