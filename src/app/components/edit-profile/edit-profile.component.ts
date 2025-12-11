import { Component, effect, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../common/service/api.service";
import { shared } from "../../app.config";
import { AuthenticationService } from "../../common/service/authentication.service";
import { Gender, User } from "../../rest/user/user.model";
import { map } from "rxjs/operators";
import { NotificationService } from "../../common/service/notification.service";
import { catchError } from "rxjs";

export const ROUTE_EDIT_PROFILE = 'edit-profile';

@Component({
    selector: 'app-edit-profile',
    imports: [shared],
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
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
    });
    genders = Object.values(Gender);

    constructor(private authService: AuthenticationService, private router: Router, private api: ApiService, private notificationService: NotificationService) {
        this.authService.activeUser.subscribe((user) => this.currentUser.set(user));
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

            this.api.userApi.updateProfile({
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
