import { Component, computed, effect, signal } from '@angular/core';
import { shared } from '../../../../app.config';
import { ApiService } from '../../../../common/service/api.service';
import { AuthenticationService } from '../../../../common/service/authentication.service';
import { NotificationService } from '../../../../common/service/notification.service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Appointment, AppointmentStaus } from '../../../../rest/hospital/hospital.model';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs';
import { ROUTE_APPOINTMENT_REPORT } from '../../reports/appoinment-report/appointment-report.component';
import { ROUTE_DENY_APPOINTMENT } from '../deny-appointment/deny-appointment.component';
import { saveAs } from 'file-saver';

export const ROUTE_DOCTOR_DASHBOARD = 'doctor-dashboard';

@Component({
    selector: 'app-doctor-dashboard',
    imports: [shared],
    templateUrl: './doctor-dashboard.component.html',
    styleUrl: './doctor-dashboard.component.scss',
})
export class DoctorDashboardComponent {
    currentUser = toSignal(this.authService.activeUser);
    allAppointments = signal<Appointment[]>([]);
    isLoading = signal(false);
    today = new Date();

    upcoming = computed(() =>
        this.allAppointments()
            .filter(a => a.appointmentStatus === AppointmentStaus.SCHEDULED)
            .sort((a, b) => new Date(a.dateAndTime).getTime() - new Date(b.dateAndTime).getTime())
    );

    completed = computed(() =>
        this.allAppointments()
            .filter(a => a.appointmentStatus === AppointmentStaus.FINISHED)
            .sort((a, b) => new Date(b.dateAndTime).getTime() - new Date(a.dateAndTime).getTime())
    );
    constructor(
        private api: ApiService,
        public authService: AuthenticationService,
        private notificationService: NotificationService,
        private router: Router
    ) {
        effect(() => {
            const user = this.currentUser();
            if (!user) return;

            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);

            this.isLoading.set(true);
            this.api.appointmentApi
                .listByHospital(user.hospital.id, null as unknown as AppointmentStaus, start.getTime(), end.getTime())
                .pipe(
                    map(r => (r.data ?? []).filter(a => a.doctor?.id === user.id)),
                    catchError(err => this.notificationService.showError(err.message))
                )
                .subscribe(appointments => {
                    if (appointments) {
                        this.allAppointments.set(appointments as Appointment[]);
                    }
                    this.isLoading.set(false);
                });
        });
    }

    startAppointment(appointmentId: number): void {
        this.router.navigate([appointmentId, ROUTE_APPOINTMENT_REPORT]);
    }

    denyAppointment(appointmentId: number): void {
        this.router.navigate([ROUTE_DENY_APPOINTMENT, appointmentId]);
    }

    downloadReport(appointmentId: number): void {
        this.api.appointmentApi
            .downloadReport(appointmentId)
            .pipe(
                map(response => {
                    if (!response.data) return;
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    saveAs(blob, `appointment-report-${appointmentId}.pdf`);
                }),
                catchError(err => this.notificationService.showError(err.message))
            )
            .subscribe();
    }

    minutesUntil(dateAndTime: Date): number {
        const diff = new Date(dateAndTime).getTime() - Date.now();
        return Math.round(diff / 60000);
    }

    isStartingSoon(dateAndTime: Date): boolean {
        const mins = this.minutesUntil(dateAndTime);
        return mins >= 0 && mins <= 15;
    }
}
