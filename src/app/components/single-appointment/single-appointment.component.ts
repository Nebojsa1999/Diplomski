import { Component, effect, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../common/service/api.service';
import { shared } from "../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../common/service/authentication.service";
import { Appointment } from "../../rest/hospital/hospital.model";
import { map } from "rxjs/operators";
import { NotificationService } from "../../common/service/notification.service";
import { catchError } from "rxjs";

export const ROUTE_SINGLE_APPOINTMENT = 'single-appointment';

@Component({
    selector: 'app-single-appointment',
    imports: [shared],
    templateUrl: './single-appointment.component.html',
    styleUrls: ['./single-appointment.component.scss']
})
export class SingleAppointmentComponent {
    date: any;
    month: any;
    fixedMonth: any;
    year: any;
    stringDate: any;
    displayedColumns: string[] = ['date', 'duration', 'doctor', 'patient', 'approve', 'deny'];
    currentUser = toSignal(this.authService.activeUser);
    appointments = signal<Appointment[] | null>(null);

    constructor(private route: ActivatedRoute, private authService: AuthenticationService, private api: ApiService, private notificationService: NotificationService) {
        effect(() => {
            const currentUser = this.currentUser();
            if (currentUser) {
                this.date = this.route.snapshot.paramMap.get("date");
                this.month = this.route.snapshot.paramMap.get("month");
                this.year = this.route.snapshot.paramMap.get("year");
                this.fixedMonth = parseInt(this.month);
                this.stringDate = this.year + "-" + this.fixedMonth + "-" + this.date;
                this.api.appointmentApi.getAppointmentsDate({
                    dateAndTime: this.stringDate,
                    duration: 0,
                    doctorId: currentUser.hospital.id
                }).pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response) => {
                    if (response) {
                        this.appointments.set(response);
                    }
                })
            }
        });
    }
}
