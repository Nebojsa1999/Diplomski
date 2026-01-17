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
import { Router } from "@angular/router";
import { ROUTE_CREATE_ROOM } from "../create-room/create-room.component";

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
    displayedColumns: string[] = ['RoomNumber', 'Type', 'Capacity', 'Update'];
    currentUser = toSignal(this.authService.activeUser);
    rooms = signal<Room[] | null>(null);
    searchFilter = signal<FilterRoomParam | null>(null)

    constructor(private authService: AuthenticationService,
                private api: ApiService,
                private router: Router,
                private notificationService: NotificationService) {
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

    addRoom() {
        this.router.navigate([ROUTE_CREATE_ROOM])
    }
}
