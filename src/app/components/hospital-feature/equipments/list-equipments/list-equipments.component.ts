import { Component, effect, signal } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { Equipment } from "../../../../rest/hospital/hospital.model";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { ApiService } from "../../../../common/service/api.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError } from "rxjs";
import { shared } from "../../../../app.config";
import { FilterEquipmentParam, FilterEquipmentsComponent } from "./filter-equipments/filter-equipments.component";
import { ROUTE_CREATE_EQUIPMENT } from "../create-equipment/create-equipment.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

export const ROUTE_EQUIPMENTS = 'equipments';

@Component({
    selector: 'app-list-equipments',
    imports: [shared, FilterEquipmentsComponent],
    templateUrl: './list-equipments.component.html',
    styleUrl: './list-equipments.component.scss',
})
export class ListEquipmentsComponent {
    displayedColumns: string[] = ['Name', 'Amount', 'Room', 'Update', 'Delete'];
    currentUser = toSignal(this.authService.activeUser);
    equipments = signal<Equipment[] | null>(null);
    searchFilter = signal<FilterEquipmentParam | null>(null)

    constructor(private authService: AuthenticationService, private router: Router, private route: ActivatedRoute, private api: ApiService, private notificationService: NotificationService, private location: Location) {
        const roomId = this.route.snapshot.queryParams['room'];
        if (roomId) {
            this.searchFilter.set({ name: '' });
        }

        effect(() => {
            const search = this.searchFilter();
                this.api.hospitalApi.getEquipmentsByRoom(roomId, search?.name).pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response => {
                    this.equipments.set(response);
                }))
        });
    }

    searchClicked(filter: FilterEquipmentParam) {
        this.searchFilter.set(filter);
    }

    goBack() { this.location.back(); }

    addEquipment() {
        this.router.navigate([ROUTE_CREATE_EQUIPMENT])
    }

    deleteEquipment(id: number) {
        this.api.hospitalApi.deleteEquipment(id).pipe(
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe(() => {
            this.notificationService.showSuccess('Equipment deleted successfully.');
            this.equipments.update(items => items?.filter(e => e.id !== id) ?? []);
        });
    }
}
