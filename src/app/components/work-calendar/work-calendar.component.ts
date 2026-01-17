import { Component, effect, signal, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../common/service/api.service';
import { shared } from "../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../common/service/authentication.service";
import { Appointment } from "../../rest/hospital/hospital.model";
import { map } from "rxjs/operators";
import { NotificationService } from "../../common/service/notification.service";
import { catchError } from "rxjs";

export const ROUTE_WORK_CALENDAR = 'calendar';

@Component({
    selector: 'app-work-calendar',
    imports: [shared],
    templateUrl: './work-calendar.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./work-calendar.component.scss']
})
export class WorkCalendarComponent {
    currentUser = toSignal(this.authService.activeUser);
    appointments = signal<Appointment[] | null>(null);
    selected: Date | null = null;

    constructor(private api: ApiService, private router: Router, private authService: AuthenticationService, private notificationService: NotificationService) {
        effect(() => {
            const currentUser = this.currentUser();
            if (currentUser) {
                this.api.appointmentApi.getScheduledAppointmentsThatAreNotFinished(currentUser.hospital.id).pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response) => {
                    this.appointments.set(response);
                });
            }
        });
    }

    getDateClass = (cellDate: any, view: any) => {
        return this.appointments()?.some(a => {
            const appointmentDate = new Date(a.dateAndTime);
            return appointmentDate.getDate() === cellDate.day &&
                appointmentDate.getMonth() + 1 === cellDate.month &&
                appointmentDate.getFullYear() === cellDate.year;
        }) ? 'example-custom-date-class' : '';
    };

    onDateSelection(date: any, appointments: Appointment[]) {
        if (appointments.some(appointment => {
            const appointmentDate = new Date(appointment.dateAndTime);
            return appointmentDate.getDate() === date.day && appointmentDate.getMonth() + 1 === date?.month && appointmentDate.getFullYear() === date.year;
        })) {
            this.router.navigate(['/single-appointment', date?.day, date?.month, date?.year]);
        }
    }
}


