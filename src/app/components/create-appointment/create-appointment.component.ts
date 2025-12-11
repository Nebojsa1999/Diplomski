import { Component, effect, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../common/service/api.service';
import { shared } from "../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../common/service/authentication.service";
import { map } from "rxjs/operators";
import { User } from "../../rest/user/user.model";
import { NotificationService } from "../../common/service/notification.service";
import { catchError } from "rxjs";

export const ROUTE_CREATE_APPOINTMENT = 'create-appointment';

@Component({
    selector: 'app-create-appointment',
    imports: [shared],
    templateUrl: './create-appointment.component.html',
    styleUrls: ['./create-appointment.component.scss']
})
export class CreateAppointmentComponent {
    form = new FormGroup({
        date: new FormControl<Date>(new Date(), [Validators.required]),
        duration: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(120)]),
        adminsOfCenter: new FormControl<User | null>(null, [Validators.required])
    });
    currentUser = toSignal(this.authService.activeUser);
    admins = signal<User[] | null>(null);

    constructor(private router: Router, private api: ApiService, private authService: AuthenticationService, private notificationService: NotificationService) {
        effect(() => {
            const currentUser = this.currentUser();
            if (currentUser) {
                this.api.centerAccountApi.getAdminsOfCenter(currentUser.centerAccount.id).pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response) => {
                    this.admins.set(response);
                });
            }
        });
    }

    onSubmit() {
        const date = this.form.get('date')?.value;
        const duration = this.form.get('duration')?.value;
        const adminOfCenterId = this.form.get('adminsOfCenter')?.value;

        this.api.centerAccountApi.createAppointment({
            dateAndTime: date as Date,
            duration: duration as number,
            adminOfCenterId: adminOfCenterId?.id as number
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess("Successfully created free appointment.")
            }
            this.router.navigate(['/center'])
        });
    }
}

