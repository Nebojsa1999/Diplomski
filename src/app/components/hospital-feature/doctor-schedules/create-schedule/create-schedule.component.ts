import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { shared } from "../../../../app.config";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { DayOfWeek } from "../../../../rest/hospital/hospital.model";
import { User, Role } from "../../../../rest/user/user.model";
import { NgxMatTimepickerComponent, NgxMatTimepickerDirective } from "ngx-mat-timepicker";
import { ApiService } from "../../../../common/service/api.service";
import { catchError, of } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_SCHEDULES } from "../list-schedules/list-schedules.component";
import { scheduleTimeValidator } from "../schedule.validators";

export const ROUTE_CREATE_SCHEDULE = 'create-doctor-schedule';

const DAY_BY_INDEX: DayOfWeek[] = [
    DayOfWeek.SUNDAY,
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
];

@Component({
    selector: 'app-create-schedule',
    imports: [shared, NgxMatTimepickerComponent, NgxMatTimepickerDirective],
    templateUrl: './create-schedule.component.html',
    styleUrl: './create-schedule.component.scss',
})
export class CreateScheduleComponent {
    doctors$ = this.apiService.userApi.list().pipe(
        map(response => response.data?.filter(u => u.role === Role.DOCTOR)),
        catchError(() => of([]))
    );

    form = new FormGroup({
        doctor: new FormControl<User | null>(null, [Validators.required]),
        startDate: new FormControl<Date | null>(null, [Validators.required]),
        endDate: new FormControl<Date | null>(null, [Validators.required]),
        days: new FormArray<FormGroup>([]),
    });

    compareDoctorById = (a: User | null, b: User | null): boolean => {
        if (!a || !b) return a === b;
        return a.id === b.id;
    };

    get daysArray(): FormArray<FormGroup> {
        return this.form.get('days') as FormArray<FormGroup>;
    }

    constructor(private apiService: ApiService, private notificationService: NotificationService, private route: ActivatedRoute, private router: Router, private location: Location) {
        const { doctorId, startDate, endDate } = this.route.snapshot.queryParams;

        if (doctorId) {
            this.apiService.userApi.getUser(+doctorId).pipe(
                map(r => r.data),
                catchError(() => of(null))
            ).subscribe(doctor => {
                if (doctor) {
                    this.form.get('doctor')?.setValue(doctor);
                    this.form.get('doctor')?.disable();
                }
            });
        }

        if (startDate) {
            this.form.get('startDate')?.setValue(new Date(startDate));
            this.form.get('startDate')?.disable();
        }

        if (endDate) {
            this.form.get('endDate')?.setValue(new Date(endDate));
            this.form.get('endDate')?.disable();
        }

        this.form.get('startDate')?.valueChanges.subscribe(() => this.rebuildDays());
        this.form.get('endDate')?.valueChanges.subscribe(() => this.rebuildDays());

        if (startDate && endDate) {
            this.rebuildDays();
        }
    }

    private rebuildDays(): void {
        const { startDate, endDate } = this.form.getRawValue();
        this.daysArray.clear();

        if (!startDate || !endDate || startDate > endDate) return;

        this.computeDaysOfWeek(new Date(startDate), new Date(endDate)).forEach(day => {
            this.daysArray.push(new FormGroup({
                dayOfWeek: new FormControl<DayOfWeek>(day),
                startTime: new FormControl<string | null>('08:00', [Validators.required]),
                endTime: new FormControl<string | null>('16:00', [Validators.required]),
                durationOfAppointmentMin: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
                breakStartTime: new FormControl<string | null>(null),
                breakEndTime: new FormControl<string | null>(null),
            }, { validators: scheduleTimeValidator }));
        });
    }

    private computeDaysOfWeek(start: Date, end: Date): DayOfWeek[] {
        const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 6) return Object.values(DayOfWeek).filter(d => d !== DayOfWeek.SUNDAY);

        const seen = new Set<DayOfWeek>();
        const days: DayOfWeek[] = [];
        const current = new Date(start);
        while (current <= end) {
            const day = DAY_BY_INDEX[current.getDay()];
            if (!seen.has(day) && day !== DayOfWeek.SUNDAY) {
                seen.add(day);
                days.push(day);
            }
            current.setDate(current.getDate() + 1);
        }
        return days;
    }

    goBack() { this.location.back(); }

    onSubmit(): void {
        const { doctor, startDate, endDate } = this.form.getRawValue() as { doctor: User, startDate: Date, endDate: Date };

        const dto = {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            days: this.daysArray.controls.map(dayGroup => ({
                dayOfWeek: dayGroup.get('dayOfWeek')?.value as DayOfWeek,
                startTime: dayGroup.get('startTime')?.value as string,
                endTime: dayGroup.get('endTime')?.value as string,
                durationOfAppointmentMin: dayGroup.get('durationOfAppointmentMin')?.value as number,
                breakStartTime: dayGroup.get('breakStartTime')?.value as string,
                breakEndTime: dayGroup.get('breakEndTime')?.value as string,
            }))
        };

        this.apiService.scheduleApi.create(doctor.id, dto).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe(response => {
            if (response) {
                this.notificationService.showSuccess('Successfully created schedules.');
                this.router.navigate([ROUTE_SCHEDULES]);
            }
        });
    }
}
