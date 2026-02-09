import { Component, effect, signal } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { Appointment, AppointmentStaus } from "../../../../rest/hospital/hospital.model";
import { ApiService } from "../../../../common/service/api.service";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError } from "rxjs";
import { shared } from "../../../../app.config";
import { Router } from "@angular/router";
import { ROUTE_CREATE_APPOINTMENT } from "../create-appointment/create-appointment.component";
import { Role } from "../../../../rest/user/user.model";
import { ROUTE_DENY_APPOINTMENT } from "../deny-appointment/deny-appointment.component";
import { ROUTE_APPOINTMENT_REPORT } from "../../reports/appoinment-report/appointment-report.component";
import { saveAs } from 'file-saver';
import { FilterAppointmentComponent } from "./filter-appointments/filter-appointment.component";
import { ROUTE_CREATE_FEEDBACK } from "../../feedbacks/create-feedback/create-feedback.component";
import { ROUTE_SCHEDULE_APPOINTMENT } from "../../schedule-appointment/schedule-appointment.component";

export const ROUTE_APPOINTMENTS = 'appointments';

@Component({
    selector: 'app-list-appointments',
    imports: [shared, FilterAppointmentComponent],
    templateUrl: './list-appointments.component.html',
    styleUrl: './list-appointments.component.scss',
})
export class ListAppointmentsComponent {
    displayedColumns: string[] = ['date', 'status', 'hospital', 'duration', 'doctor', 'patient', 'actions'];
    currentUser = toSignal(this.authService.activeUser);
    appointments = signal<Appointment[] | null>(null);
    Role = Role;
    AppointmentStaus = AppointmentStaus;
    appointmentStatus = signal<AppointmentStaus | null>(null);
    dateRange = signal<{ from: Date | null, to: Date | null } | null>(null)

    placeHodler: any = [{
        dateAndTime: null,
        appointmentStatus: null,
        duration: null,
        doctor: null,
        patient: null
    }] as any[];

    constructor(private api: ApiService, public authService: AuthenticationService, private notificationService: NotificationService, private router: Router) {
        effect(() => {
            const currentUser = this.currentUser();
            const status = this.appointmentStatus();
            const date = this.dateRange();
            const fromTs = date?.from ? new Date(date.from).getTime() : null;
            const toTs = date?.to ? new Date(date.to).getTime() : null;
            if (authService.hasRole(Role.ADMIN_SYSTEM)) {
                this.api.appointmentApi.list(status as AppointmentStaus, fromTs, toTs).pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response) => {
                    if (response) {
                        const sortedAppointments = this.sortAppointments(response);
                        this.appointments.set(sortedAppointments);
                    }
                });
            } else if (authService.hasRole(Role.DOCTOR)) {
                this.api.appointmentApi.listByHospital(currentUser?.hospital.id as number, status as AppointmentStaus, fromTs, toTs).pipe(
                    map(response => (response.data ?? []).filter(appointments => appointments.doctor.id === currentUser?.id)),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response) => {
                    if (response) {
                        const sortedAppointments = this.sortAppointments(response);
                        this.appointments.set(sortedAppointments);
                    }
                });
            } else {
                this.api.appointmentApi.listByHospital(currentUser?.hospital.id as number, status as AppointmentStaus, fromTs, toTs).pipe(
                    map(response => (response.data ?? []).filter(appointments => appointments.patient?.id === currentUser?.id || appointments.patient === null)),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response) => {
                    if (response) {
                        const sortedAppointments = this.sortAppointments(response);
                        this.appointments.set(sortedAppointments);
                    }
                });
            }
        });
    }

    addFreeAppointments() {
        this.router.navigate([ROUTE_CREATE_APPOINTMENT]);
    }

    schedule(appointmentId: number) {
        this.api.appointmentApi.scheduleAppointment(appointmentId).pipe(
            map(response => response.data),
            catchError(error =>
                this.notificationService.showError(error)
            )
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess("Successfully scheduled your appointment.")
                this.appointments.update((appointments) =>
                    appointments?.map(a => a.id === appointmentId ? response : a) || []
                );
            }
        })
    }

    deny(appointmentId: number) {
        this.router.navigate([ROUTE_DENY_APPOINTMENT, appointmentId])
    }

    approve(appointmentId: number) {
        this.router.navigate([appointmentId, ROUTE_APPOINTMENT_REPORT])
    }

    comment(appointmentId: number) {
        this.router.navigate([appointmentId, ROUTE_CREATE_FEEDBACK])
    }

    patientScheduleAppointment() {
        this.router.navigate([ROUTE_SCHEDULE_APPOINTMENT])
    }

    downloadReport(appointmentId: number) {
        return this.api.appointmentApi
            .downloadReport(appointmentId)
            .pipe(
                map((response) => {
                    if (response.data == null) {
                        return;
                    }

                    const blob = new Blob([response.data], {type: 'application/pdf'});
                    saveAs(blob, `appointment-report.pdf`);
                }),
                catchError(error => this.notificationService.showError(error.message))
            )
            .subscribe();
    }

    downloadPrescription(appointmentId: number) {
        return this.api.appointmentApi
            .downloadPrescription(appointmentId)
            .pipe(
                map((response) => {
                    if (response.data == null) {
                        return;
                    }

                    const blob = new Blob([response.data], {type: 'application/pdf'});
                    saveAs(blob, `prescription.pdf`);
                }),
                catchError(error => this.notificationService.showError(error.message))
            )
            .subscribe();
    }

    searchClicked(searchParams: AppointmentStaus | null) {
        this.appointmentStatus.set(searchParams)
    }

    setDateRange(dateRange: { from: Date | null; to: Date | null }) {
        this.dateRange.set({from: dateRange.from, to: dateRange.to})
    }

    private sortAppointments(appointments: Appointment[]): Appointment[] {
        return appointments?.sort((a, b) => new Date(a.dateAndTime).getTime() - new Date(b.dateAndTime).getTime()) ?? [];
    }
}
