import { Component, effect, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../common/service/api.service';
import { shared } from "../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../common/service/authentication.service";
import { NotificationService } from "../../common/service/notification.service";
import { Appointment } from "../../rest/hospital/hospital.model";
import { catchError } from "rxjs";
import { map } from "rxjs/operators";

export const ROUTE_START_APPOINTMENT = 'approve-appointment';

@Component({
    selector: 'app-start-appointment',
    imports: [shared],
    templateUrl: './start-appointment.component.html',
    styleUrls: ['./start-appointment.component.scss']
})
export class StartAppointmentComponent {
    appointmentIdString: any;
    appointmentId: any;
    currentUser = toSignal(this.authService.activeUser);
    appointment = signal<Appointment | null>(null);

    constructor(private authService: AuthenticationService, private api: ApiService, private route: ActivatedRoute, private notificationService: NotificationService) {
        effect(() => {
            const currentUser = this.currentUser();
            this.appointmentIdString = this.route.snapshot.queryParamMap.get('id');
            this.appointmentId = parseInt(this.appointmentIdString);
            this.api.appointmentApi.getAppointment(this.appointmentId).pipe(
                map(response => response.data),
                catchError((error) => this.notificationService.showError(error))
            ).subscribe((response => {
                if (response) {
                    this.appointment.set(response);

                }
            }))
        });


    }
}
