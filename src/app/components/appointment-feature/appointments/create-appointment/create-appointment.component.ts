import { Component, effect, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../common/service/api.service';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { map } from "rxjs/operators";
import { Role, User } from "../../../../rest/user/user.model";
import { NotificationService } from "../../../../common/service/notification.service";
import { catchError } from "rxjs";
import { NgxMatTimepickerComponent, NgxMatTimepickerDirective } from "ngx-mat-timepicker";
import { ROUTE_APPOINTMENTS } from "../list-appointments/list-appointments.component";

export const ROUTE_CREATE_APPOINTMENT = 'create-appointment';

@Component({
    selector: 'app-create-appointment',
    imports: [shared, NgxMatTimepickerComponent, NgxMatTimepickerDirective],
    templateUrl: './create-appointment.component.html',
    styleUrls: ['./create-appointment.component.scss']
})
export class CreateAppointmentComponent {
    form = new FormGroup({
        date: new FormControl<Date | null>(new Date(), [Validators.required]),
        time: new FormControl<string | null>(null, [Validators.required]),
        duration: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(120)]),
        doctor: new FormControl<User | null>(null, [Validators.required])
    });
    currentUser = toSignal(this.authService.activeUser);
    doctors = signal<User[] | null>(null);
    minDate = new Date();
    hospitals = this.api.hospitalApi.list().pipe(
        map(response => response.data),
        catchError(error => error.data)
    )

    constructor(private router: Router, private api: ApiService, private authService: AuthenticationService, private notificationService: NotificationService) {
        effect(() => {
            const currentUser = this.currentUser();
            if (currentUser) {
                this.api.hospitalApi.getUsersFromHospital(currentUser.hospital.id, Role.DOCTOR).pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response) => {
                    this.doctors.set(response);
                });
            }
        });
    }

    onSubmit() {
        const date = this.form.get('date')?.value;
        const time = this.form.get('time')?.value;
        const duration = this.form.get('duration')?.value;
        const doctorId = this.form.get('doctor')?.value;
        const dateTime = new Date(date as Date);

        if (date && time) {
            const [hoursStr, minutesStr] = time.split(':');
            const hours = parseInt(hoursStr, 10);
            const minutes = parseInt(minutesStr, 10);
            dateTime.setHours(hours);
            dateTime.setMinutes(minutes);
        }

        this.api.appointmentApi.createAppointment({
            dateAndTime: dateTime.toISOString(),
            duration: duration as number,
            doctorId: doctorId?.id as number
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess("Successfully created free appointment.")
            }
            this.router.navigate([ROUTE_APPOINTMENTS])
        });
    }

    minTime(): string {
        const selectedValue = this.form.get('date')?.value;

        if (!selectedValue) {
            return '00:00';
        }

        const selected = selectedValue instanceof Date ? selectedValue : new Date(selectedValue);

        const min = this.minDate;

        const isToday =
            selected.getFullYear() === min.getFullYear() &&
            selected.getMonth() === min.getMonth() &&
            selected.getDate() === min.getDate();

        if (isToday) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        } else {
            return '00:00';
        }
    }
}

