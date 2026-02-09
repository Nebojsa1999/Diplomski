import { Component, signal } from '@angular/core';
import { shared } from "../../../app.config";
import { Appointment, AppointmentStaus, DoctorType, DoctorTypeMap, PatientScheduleMap, PatientScheduleType } from "../../../rest/hospital/hospital.model";
import { MatStep, MatStepLabel, MatStepper, MatStepperPrevious } from "@angular/material/stepper";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../common/service/api.service";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../common/service/notification.service";
import { ROUTE_APPOINTMENTS } from "../appointments/list-appointments/list-appointments.component";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../../common/service/authentication.service";
import { toSignal } from "@angular/core/rxjs-interop";

export const ROUTE_SCHEDULE_APPOINTMENT = 'schedule-appointment';

@Component({
    selector: 'app-schedule-appointment',
    imports: [shared, MatStepper, MatStep, MatStepLabel, MatStepperPrevious],
    templateUrl: './schedule-appointment.component.html',
    styleUrl: './schedule-appointment.component.scss',
})
export class ScheduleAppointmentComponent {

    scheduleTypes = Object.values(PatientScheduleType).map(type => ({
        type,
        icon: PatientScheduleMap[type],
        label: PatientScheduleMap[type],
        color: PatientScheduleMap[type]
    }));

    doctorForm: FormGroup;
    selectedDate: Date | null = null;
    appointments = signal<Appointment[] | null>(null);
    selectedAppointment: Appointment | null = null;
    currentUser = toSignal(this.authService.activeUser);

    constructor(private fb: FormBuilder,
                private notificationService: NotificationService,
                private router: Router,
                private authService: AuthenticationService,
                private apiService: ApiService) {
        this.doctorForm = this.fb.group({
            doctorType: new FormControl<DoctorType | null>(null, [Validators.required])
        });
    }

    selectDate(date: Date) {
        this.selectedDate = date;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const doctorType = this.doctorForm.get('doctorType')?.value

        this.apiService.appointmentApi.listByHospital(this.currentUser()?.hospital.id as number, AppointmentStaus.OPEN, startOfDay.getTime(), endOfDay.getTime(), this.getDoctorType(doctorType)).pipe(
            map(response => response.data)
        ).subscribe((response) => {
            if (response)
                this.appointments.set(response)
        })
    }

    selectScheduleType(scheduleType: string, stepper: MatStepper) {
        if (scheduleType !== this.doctorForm.get('doctorType')?.value) {
            this.selectedDate = null;
            this.appointments.set([])
        }
        this.doctorForm.patchValue({doctorType: scheduleType});
        stepper.next();
    }

    confirm(appointment: Appointment | null) {
        if (appointment) {
            this.apiService.appointmentApi.scheduleAppointment(appointment.id).pipe(
                map(response => response.data)
            ).subscribe((response) => {
                if (response) {
                    this.notificationService.showSuccess("Successfully scheduled your appointment.");
                    this.router.navigate([ROUTE_APPOINTMENTS])
                }
            })
        }
    }

    selectAppointment(appointment: Appointment, stepper: MatStepper) {
        this.selectedAppointment = appointment;
        stepper.next();
    }

    private getDoctorType(scheduleType: PatientScheduleType): DoctorType {
        return DoctorTypeMap[scheduleType];
    }
}
