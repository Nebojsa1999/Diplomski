import { Component } from '@angular/core';
import { shared } from "../../../../app.config";
import { OperationType, Room, RoomType } from "../../../../rest/hospital/hospital.model";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../common/service/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { map, startWith } from "rxjs/operators";
import { catchError, of, switchMap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NotificationService } from "../../../../common/service/notification.service";
import { ROUTE_APPOINTMENTS } from "../../appointments/list-appointments/list-appointments.component";

export const ROUTE_CREATE_ROOM_BOOKING = 'create-room-booking';

@Component({
    selector: 'app-create-room-booking',
    imports: [
        shared
    ],
    templateUrl: './create-room-booking.component.html',
    styleUrl: './create-room-booking.component.scss',
})

export class CreateRoomBookingComponent {

    form = new FormGroup({
        operationType: new FormControl<OperationType | null>(OperationType.THERAPY, [Validators.required]),
        startDate: new FormControl<Date | null>(new Date(), [Validators.required]),
        endDate: new FormControl<Date | null>(new Date(), [Validators.required]),
        room: new FormControl<Room | null>(null, [Validators.required]),
    });
    operationType = Object.values(OperationType);
    rooms$ = (this.form.get('operationType') as AbstractControl).valueChanges.pipe(
        startWith(this.form.controls.operationType.value),
        takeUntilDestroyed(),
        switchMap((operationType) => {
            if (operationType === null) {
                return of([]);
            } else {
                return this.apiService.hospitalApi.availableRooms(this.route.snapshot.params['id'], '', operationType === OperationType.SURGERY ? RoomType.OPERATION : RoomType.RECOVERY).pipe(
                    map(response => response.data),
                    catchError(err => of([]))
                )
            }
        })
    )
    minDate = new Date();

    constructor(private apiService: ApiService,
                private notificationService: NotificationService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    onSubmit() {
        const operationType = this.form.get('operationType')?.value;
        const startDate = this.form.get('startDate')?.value;
        const endDate = this.form.get('endDate')?.value;
        const room = this.form.get('room')?.value;
        this.apiService.appointmentApi.createRoomBooking(this.route.snapshot.params['id'], {
            operationType: operationType as OperationType,
            startTime: startDate as Date,
            endTime: endDate as Date,
            room: room as Room
        }).pipe(
            map(response => response.data),
            catchError((error) => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess("Successfully booked room.");
                this.router.navigate([ROUTE_APPOINTMENTS]);
            }
        });
    }
}
