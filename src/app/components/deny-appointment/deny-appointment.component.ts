import { Component, effect, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../common/service/api.service';
import { shared } from "../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../common/service/authentication.service";
import { catchError } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../common/service/notification.service";
import { Appointment } from "../../rest/hospital/hospital.model";

export const ROUTE_DENY_APPOINTMENT = 'deny-appointment';

@Component({
    selector: 'app-deny-appointment',
    imports: [shared],
    templateUrl: './deny-appointment.component.html',
    styleUrls: ['./deny-appointment.component.scss']
})

export class DenyAppointmentComponent {
    appointmentIdString: any;
    appointmentId: any;
    currentUser = toSignal(this.authService.activeUser);
    appointment = signal<Appointment | null>(null)

    constructor(private router: Router,
                private api: ApiService,
                private route: ActivatedRoute,
                private notificationService: NotificationService,
                private authService: AuthenticationService
    ) {
        effect(() => {
            const currentUser = this.currentUser();
            if (currentUser) {
                this.appointmentIdString = this.route.snapshot.queryParamMap.get('id');
                this.appointmentId = parseInt(this.appointmentIdString);
                this.api.appointmentApi.getAppointment(this.appointmentId).pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error))
                ).subscribe((response => {
                    if (response)
                        this.appointment.set(response);
                }))
            }
        });
    }

    deny() {
        this.api.appointmentApi.deny({
            id: this.appointmentId
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response => {
            this.notificationService.showSuccess("Successfully denied appointment.")
            this.router.navigate(['/appointments'])
        }));
    }
}
