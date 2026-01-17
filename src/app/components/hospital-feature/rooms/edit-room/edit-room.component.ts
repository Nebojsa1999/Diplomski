import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Hospital, Room, RoomType } from "../../../../rest/hospital/hospital.model";
import { map } from "rxjs/operators";
import { catchError, of } from "rxjs";
import { ApiService } from "../../../../common/service/api.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ROUTE_ROOMS } from "../list-rooms/list-rooms.component";
import { shared } from "../../../../app.config";

export const ROUTE_EDIT_ROOM = 'edit-room';

@Component({
    selector: 'app-edit-room',
    imports: [shared],
    templateUrl: './edit-room.component.html',
    styleUrl: './edit-room.component.scss',
})
export class EditRoomComponent {
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

    compareHospitalById = (a: Hospital | null, b: Hospital | null): boolean => {
        if (!a || !b) {
            return a === b;
        }
        return a.id === b.id;
    };

    types = Object.values(RoomType)

    constructor(private apiService: ApiService, private notificationService: NotificationService, private router: Router, private route: ActivatedRoute) {
        this.form.get('hospital')?.disable()
        const id = this.route.snapshot.params['id']
        this.apiService.hospitalApi.getRoom(id).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((room) => {

            this.form.patchValue({
                roomNumber: room?.roomNumber,
                roomType: room?.type,
                capacity: room?.capacity,
                hospital: room?.hospital
            })
        });
        this.onTypeChange();
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

        this.apiService.hospitalApi.editRoom(this.route.snapshot.params['id'], room).pipe(
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
