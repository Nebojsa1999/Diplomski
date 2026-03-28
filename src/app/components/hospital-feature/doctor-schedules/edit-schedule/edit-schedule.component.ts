import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DayOfWeek, DoctorScheduleUpdateDto } from "../../../../rest/hospital/hospital.model";
import { User } from "../../../../rest/user/user.model";
import { NgxMatTimepickerComponent, NgxMatTimepickerDirective } from "ngx-mat-timepicker";
import { ApiService } from "../../../../common/service/api.service";
import { catchError } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_SCHEDULES } from "../list-schedules/list-schedules.component";
import { scheduleTimeValidator } from "../schedule.validators";

export const ROUTE_EDIT_SCHEDULE = 'edit-doctor-schedule';

@Component({
    selector: 'app-edit-schedule',
    imports: [shared, NgxMatTimepickerComponent, NgxMatTimepickerDirective],
    templateUrl: './edit-schedule.component.html',
    styleUrl: './edit-schedule.component.scss',
})
export class EditScheduleComponent {
    daysOfWeek = Object.values(DayOfWeek).filter(d => d !== DayOfWeek.SUNDAY);

    form = new FormGroup({
        doctor: new FormControl<User | null>(null, [Validators.required]),
        dayOfWeek: new FormControl<DayOfWeek | null>(null, [Validators.required]),
        startDate: new FormControl<Date | null>(null, [Validators.required]),
        endDate: new FormControl<Date | null>(null, [Validators.required]),
        startTime: new FormControl<string | null>(null, [Validators.required]),
        endTime: new FormControl<string | null>(null, [Validators.required]),
        durationOfAppointmentMin: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
        breakStartTime: new FormControl<string | null>(null),
        breakEndTime: new FormControl<string | null>(null),
    }, { validators: scheduleTimeValidator });

    private weekStart: string | null = null;

    constructor(private apiService: ApiService, private route: ActivatedRoute, private notificationService: NotificationService, private router: Router, private location: Location) {
        this.weekStart = this.route.snapshot.queryParams['weekStart'] ?? null;
        this.form.get('doctor')?.disable();
        const id = +this.route.snapshot.params['id'];
        this.apiService.scheduleApi.getById(id).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe(schedule => {
            if (schedule) {
                const toHHmm = (t: string | null | undefined) => t ? t.substring(0, 5) : null;
                this.form.patchValue({
                    doctor: schedule.doctor,
                    dayOfWeek: schedule.dayOfWeek,
                    startDate: new Date(schedule.startDate),
                    endDate: new Date(schedule.endDate),
                    startTime: toHHmm(schedule.startTime),
                    endTime: toHHmm(schedule.endTime),
                    durationOfAppointmentMin: schedule.durationOfAppointmentMin,
                    breakStartTime: toHHmm(schedule.breakStartTime),
                    breakEndTime: toHHmm(schedule.breakEndTime),
                });
            }
        });
    }

    goBack() { this.location.back(); }

    onSubmit() {
        const dto: DoctorScheduleUpdateDto = {
            dayOfWeek: this.form.get('dayOfWeek')?.value as DayOfWeek,
            startDate: (this.form.get('startDate')?.value as Date).toISOString(),
            endDate: (this.form.get('endDate')?.value as Date).toISOString(),
            startTime: this.form.get('startTime')?.value as string,
            endTime: this.form.get('endTime')?.value as string,
            durationOfAppointmentMin: this.form.get('durationOfAppointmentMin')?.value as number,
            breakStartTime: this.form.get('breakStartTime')?.value as string,
            breakEndTime: this.form.get('breakEndTime')?.value as string,
        };

        this.apiService.scheduleApi.update(+this.route.snapshot.params['id'], dto).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe(response => {
            if (response) {
                this.notificationService.showSuccess('Successfully updated schedule.');
                this.router.navigate([ROUTE_SCHEDULES], {
                    queryParams: this.weekStart ? { weekStart: this.weekStart } : {}
                });
            }
        });
    }
}
