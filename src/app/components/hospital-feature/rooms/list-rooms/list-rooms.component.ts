import { Component, effect, signal } from '@angular/core';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { ApiService } from "../../../../common/service/api.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError } from "rxjs";
import { FilterRoomParam, FilterRoomsComponent } from "./filter-rooms/filter-rooms.component";
import { Room } from "../../../../rest/hospital/hospital.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_CREATE_ROOM } from "../create-room/create-room.component";
import { ROUTE_HOSPITALS } from "../../hospitals/list-hospitals/list-hospitals.component";
import { Role } from "../../../../rest/user/user.model";
import { ROUTE_ROOM_BOOKINGS } from "../../../appointment-feature/room-bookings/list-room-bookings/list-room-bookings.component";

export const ROUTE_ROOMS = 'rooms';

@Component({
    selector: 'app-list-rooms',
    imports: [
        shared,
        FilterRoomsComponent
    ],
    templateUrl: './list-rooms.component.html',
    styleUrl: './list-rooms.component.scss',
})
export class ListRoomsComponent {
    displayedColumns: string[] = ['RoomNumber', 'Type', 'Capacity', 'Update', 'Actions', 'Delete'];
    currentUser = toSignal(this.authService.activeUser);
    rooms = signal<Room[] | null>(null);
    searchFilter = signal<FilterRoomParam | null>(null)
    Role = Role;

    constructor(private authService: AuthenticationService,
                private api: ApiService,
                private router: Router,
                private route: ActivatedRoute,
                private notificationService: NotificationService) {
        const hospitalId = this.route.snapshot.queryParams['hospitalId'];
        if (hospitalId) {
            this.searchFilter.set({ roomNumber: '', hospital: +hospitalId });
        }

        effect(() => {
            const search = this.searchFilter();

            if (search?.hospital) {
                this.api.hospitalApi.availableRooms(search.hospital as number, search.roomNumber ?? '').pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response => {
                    this.rooms.set(response);
                }))
            } else {
                this.api.hospitalApi.listRooms(search?.roomNumber).pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response => {
                    this.rooms.set(response);
                }))
            }
        });
    }

    searchClicked(filter: FilterRoomParam) {
        this.searchFilter.set(filter);
    }

    goBack() {
        this.router.navigate([ROUTE_HOSPITALS]);
    }

    addRoom() {
        this.router.navigate([ROUTE_CREATE_ROOM])
    }


    goToRooms(id: number) {
        this.router.navigate([id, ROUTE_ROOM_BOOKINGS])
    }

    deleteRoom(id: number) {
        this.api.hospitalApi.deleteRoom(id).pipe(
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe(() => {
            this.rooms.update(items => items?.filter(r => r.id !== id) ?? []);
        });
    }
}
