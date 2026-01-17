import { Component } from '@angular/core';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Hospital, Room, RoomType } from "../../../../rest/hospital/hospital.model";
import { ApiService } from "../../../../common/service/api.service";
import { catchError, of } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { Router } from "@angular/router";
import { ROUTE_ROOMS } from "../list-rooms/list-rooms.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export const ROUTE_CREATE_ROOM = 'create-room';

@Component({
    selector: 'app-create-room',
    imports: [shared],
    templateUrl: './create-room.component.html',
    styleUrl: './create-room.component.scss',
})
export class CreateRoomComponent {
    form = new FormGroup({
        roomNumber: new FormControl<string | null>('', [Validators.required]),
        roomType: new FormControl<RoomType | null>(null, [Validators.required]),
        capacity: new FormControl<number | null>(null, [Validators.required]),
        hospital: new FormControl<Hospital | null>(null, [Validators.required])
    });
    hospital$ = this.apiService.hospitalApi.list().pipe(
        map(response => response.data),
        catchError(error => of([]))
    )

    types = Object.values(RoomType)

    constructor(private apiService: ApiService, private notificationService: NotificationService, private router: Router) {
        this.onTypeChange()
    }

    onTypeChange() {
        this.form.get('roomType')?.valueChanges.pipe(
            takeUntilDestroyed()
        ).subscribe((type) => {
            if (type === RoomType.OPERATION) {
                this.form.get('capacity')?.setValue(1);
                this.form.get('capacity')?.disable();
            } else {
                this.form.get('capacity')?.enable();
            }
        })
    }

    onSubmit() {
        const roomNumber = this.form.get('roomNumber')?.value;
        const type = this.form.get('roomType')?.value;
        const capacity = this.form.get('capacity')?.getRawValue();
        const hospital = this.form.get('hospital')?.value;

        const room: Room = {
            capacity: capacity as number,
            type: type as RoomType,
            roomNumber: roomNumber as string,
            hospital: hospital as Hospital
        }

        this.apiService.hospitalApi.createRoom(room).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully created room.');
                this.router.navigate([ROUTE_ROOMS]);
            }
        });
    }
}
