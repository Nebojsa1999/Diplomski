import { Component, effect, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../../common/service/api.service";
import { shared } from "../../../../app.config";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { Gender, Role, User } from "../../../../rest/user/user.model";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { catchError, of } from "rxjs";
import { Hospital } from "../../../../rest/hospital/hospital.model";

export const ROUTE_EDIT_PROFILE = 'edit-profile';

@Component({
    selector: 'app-edit-profile',
    imports: [shared],
    templateUrl: './edit-user-profile.component.html',
    styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent {
    currentUser = signal<User | null>(null);
    form = new FormGroup({
        firstName: new FormControl<string>('', Validators.required),
        lastName: new FormControl<string>('', Validators.required),
        address: new FormControl<string>('', Validators.required),
        city: new FormControl<string>('', Validators.required),
        country: new FormControl<string>('', Validators.required),
        phone: new FormControl<string>('', Validators.required),
        personalId: new FormControl<string>('', Validators.required),
        occupation: new FormControl<string>('', Validators.required),
        occupationInfo: new FormControl<string>('', Validators.required),
        gender: new FormControl<Gender | null>(null, Validators.required),
        role: new FormControl<Role | null>(null, [Validators.required]),
        hospital: new FormControl<Hospital | null>(null, [Validators.required])
    });
    genders = Object.values(Gender);
    roles = Object.values(Role);
    hospitals$ = this.api.hospitalApi.list().pipe(
        map(response => response.data),
        catchError(error => of([]))
    )

    compareHospitalById = (a: Hospital | null, b: Hospital | null): boolean => {
        if (!a || !b) {
            return a === b;
        }
        return a.id === b.id;
    };

    constructor(private authService: AuthenticationService, private route: ActivatedRoute, private api: ApiService, private notificationService: NotificationService) {
        const id = this.route.snapshot.params['id']
        this.api.userApi.getUser(id).pipe(map(response => response.data)).subscribe((user) => this.currentUser.set(user))
        this.form.get('role')?.disable()
        this.form.get('hospital')?.disable()

        effect(() => {
            const user = this.currentUser();
            if (user) {
                this.form.patchValue({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    address: user.lastName,
                    city: user.city,
                    country: user.country,
                    phone: user.phone,
                    personalId: user.personalId,
                    occupation: user.occupation,
                    occupationInfo: user.occupationInfo,
                    gender: user.gender as Gender,
                    role: user.role,
                    hospital: user.hospital
                })
            }
        });
    }

    onSubmit() {
        if (this.form.valid) {
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

            this.api.userApi.updateUser(this.route.snapshot.params['id'], {
                firstName: firstName as string,
                lastName: lastName as string,
                address: address as string,
                city: city as string,
                country: country as string,
                phone: phone as string,
                personalId: personalId as string,
                occupation: occupation as string,
                occupationInfo: occupationInfo as string,
                gender: gender as Gender
            }).pipe(
                map(response => response.data),
                catchError(error => this.notificationService.showError(error.message))
            ).subscribe((user) => {
                if (user) {
                    this.currentUser.set(user);
                    this.authService.updateCurrentUser(user);
                    this.notificationService.showSuccess("Successfully updated profile.")
                }
            });
        }
    }
}
