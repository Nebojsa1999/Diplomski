import { Component, effect, signal } from '@angular/core';
import { OperationRoomBooking } from "../../../../rest/hospital/hospital.model";
import { ApiService } from "../../../../common/service/api.service";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError } from "rxjs";
import { shared } from "../../../../app.config";
import { ActivatedRoute, Router } from "@angular/router";

export const ROUTE_ROOM_BOOKINGS = 'room-bookings';

@Component({
    selector: 'app-list-room-bookings',
    imports: [shared],
    templateUrl: './list-room-bookings.component.html',
    styleUrl: './list-room-bookings.component.scss',
})
export class ListRoomBookingsComponent {
    displayedColumns: string[] = ['room', 'doctor', 'patient', 'startTime', 'endTime', 'operationType'];
    bookings = signal<OperationRoomBooking[] | null>(null);

    constructor(private api: ApiService, public authService: AuthenticationService, private notificationService: NotificationService, private router: Router, private route: ActivatedRoute) {
        effect(() => {
            this.api.appointmentApi.listRoomBooking(this.route.snapshot.params['id']).pipe(
                map(response => response.data),
                catchError(error => this.notificationService.showError(error.message))
            ).subscribe((response) => {
                this.bookings.set(response);
            });
        });
    }
}
