import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Hospital, Room, RoomType } from "../../../../rest/hospital/hospital.model";
import { ApiService } from "../../../../common/service/api.service";
import { catchError } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { Router } from "@angular/router";
import { ROUTE_ROOMS } from "../list-rooms/list-rooms.component";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../../../common/service/authentication.service";

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
    types = Object.values(RoomType);
    currentUser = toSignal(this.authService.activeUser);

    constructor(
        private apiService: ApiService,
        private authService: AuthenticationService,
        private notificationService: NotificationService,
        private router: Router,
        private location: Location
    ) {
        this.onTypeChange();

        const hospital = this.currentUser()?.hospital;
        if (hospital) {
            this.form.get('hospital')?.setValue(hospital);
        }
    }

    goBack() { this.location.back(); }

    onTypeChange() {
        this.form.get('roomType')?.valueChanges.pipe(
            takeUntilDestroyed()
        ).subscribe((type) => {
            const capacity = this.form.get('capacity')!;
            if (type === RoomType.OPERATION) {
                capacity.setValue(1);
                capacity.disable();
                capacity.setValidators([Validators.required]);
            } else if (type === RoomType.RECOVERY) {
                capacity.enable();
                capacity.setValidators([Validators.required, Validators.max(5), Validators.min(1)]);
            } else {
                capacity.enable();
                capacity.setValidators([Validators.required]);
            }
            capacity.updateValueAndValidity();
        });
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
