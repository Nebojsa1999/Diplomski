import { Component, computed, effect, signal } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { Appointment, AppointmentStaus } from "../../../../rest/hospital/hospital.model";
import { ApiService } from "../../../../common/service/api.service";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError, switchMap } from "rxjs";
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
import { MatDialog } from "@angular/material/dialog";
import { CancelAppointmentDialogComponent } from "../cancel-appointment-dialog/cancel-appointment-dialog.component";

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
    dateRange = signal<{ from: Date | null, to: Date | null } | null>(null);
    activeTab = signal<'all' | 'upcoming' | 'completed'>('all');

    upcomingAppointments = computed(() =>
        (this.appointments() ?? []).filter(a =>
            a.appointmentStatus === AppointmentStaus.OPEN ||
            a.appointmentStatus === AppointmentStaus.SCHEDULED
        )
    );

    completedAppointments = computed(() =>
        (this.appointments() ?? []).filter(a =>
            a.appointmentStatus === AppointmentStaus.FINISHED ||
            a.appointmentStatus === AppointmentStaus.CANCELLED
        )
    );

    visibleAppointments = computed(() => {
        const tab = this.activeTab();
        const all = this.appointments() ?? [];
        if (tab === 'upcoming') return this.upcomingAppointments();
        if (tab === 'completed') return this.completedAppointments();
        return all;
    });

    placeHodler: any = [{
        dateAndTime: null,
        appointmentStatus: null,
        duration: null,
        doctor: null,
        patient: null
    }] as any[];

    constructor(
        private api: ApiService,
        public authService: AuthenticationService,
        private notificationService: NotificationService,
        private router: Router,
        private dialog: MatDialog
    ) {
        effect(() => {
            const currentUser = this.currentUser();
            const date = this.dateRange();
            const fromTs = date?.from ? new Date(date.from).getTime() : null;
            const toTs = date?.to ? new Date(date.to).getTime() : null;
            if (authService.hasRole(Role.ADMIN_SYSTEM)) {
                this.api.appointmentApi.list(null as unknown as AppointmentStaus, fromTs, toTs).pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response) => {
                    if (response) {
                        const sortedAppointments = this.sortAppointments(response);
                        this.appointments.set(sortedAppointments);
                    }
                });
            } else {
                this.api.appointmentApi.listForCurrentUser(null as unknown as AppointmentStaus, fromTs, toTs).pipe(
                    map(response => response.data?.content ?? []),
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

    downloadLabDocument(appointmentId: number) {
        return this.api.appointmentApi.getLabDocument(appointmentId).pipe(
            switchMap(meta => {
                const filename = meta.data?.originalFilename ?? 'lab-document';
                const contentType = meta.data?.contentType ?? 'application/octet-stream';
                return this.api.appointmentApi.downloadLabDocument(appointmentId).pipe(
                    map(response => {
                        if (response.data == null) return;
                        const blob = new Blob([response.data], { type: contentType });
                        saveAs(blob, filename);
                    })
                );
            }),
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe();
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

    setDateRange(dateRange: { from: Date | null; to: Date | null }) {
        this.dateRange.set({from: dateRange.from, to: dateRange.to})
    }

    uploadLabDocument(appointmentId: number, event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;
        this.api.appointmentApi.uploadLabDocument(appointmentId, file).pipe(
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe(() => {
            this.notificationService.showSuccess('Lab document uploaded successfully.');
        });
    }

    deleteAppointment(id: number) {
        this.api.appointmentApi.deleteAppointment(id).pipe(
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe(() => {
            this.notificationService.showSuccess('Appointment deleted successfully.');
            this.appointments.update(items => items?.filter(a => a.id !== id) ?? []);
        });
    }

    setTab(tab: 'all' | 'upcoming' | 'completed'): void {
        this.activeTab.set(tab);
    }

    cancelAppointment(appointment: Appointment): void {
        const ref = this.dialog.open(CancelAppointmentDialogComponent, {
            data: { appointment },
            width: '420px',
        });
        ref.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.api.appointmentApi.deleteAppointment(appointment.id).pipe(
                    catchError(err => this.notificationService.showError(err.message))
                ).subscribe(() => {
                    this.notificationService.showSuccess('Appointment cancelled successfully.');
                    this.appointments.update(items => items?.filter(a => a.id !== appointment.id) ?? []);
                });
            }
        });
    }

    private sortAppointments(appointments: Appointment[]): Appointment[] {
        return appointments?.sort((a, b) => {
            const aScheduled = a.appointmentStatus === AppointmentStaus.SCHEDULED ? 0 : 1;
            const bScheduled = b.appointmentStatus === AppointmentStaus.SCHEDULED ? 0 : 1;
            if (aScheduled !== bScheduled) return aScheduled - bScheduled;
            return new Date(b.dateAndTime).getTime() - new Date(a.dateAndTime).getTime();
        }) ?? [];
    }
}
