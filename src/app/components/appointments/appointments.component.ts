import { Component, effect, signal } from '@angular/core';
import { ApiService } from "../../common/service/api.service";
import { shared } from "../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../common/service/authentication.service";
import { Appointment } from "../../rest/center-account/center.account.model";
import { map } from "rxjs/operators";
import { NotificationService } from "../../common/service/notification.service";
import { catchError } from "rxjs";

export const ROUTE_APPOINTMENTS = 'appointments';

@Component({
    selector: 'app-appointments',
    imports: [shared],
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent {
    displayedColumns: string[] = ['date', 'duration', 'adminCenter', 'patient', 'approve', 'deny'];
    currentUser = toSignal(this.authService.activeUser);
    appointments = signal<Appointment[] | null>(null);

    constructor(private api: ApiService, private authService: AuthenticationService, private notificationService: NotificationService) {
        effect(() => {
            const currentUser = this.currentUser();
            if (currentUser) {
                this.api.centerAccountApi.getScheduledAppointmentsThatAreNotFinished(currentUser.centerAccount.id).pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response) => {
                    this.appointments.set(response);
                });
            }
        });
    }
}
