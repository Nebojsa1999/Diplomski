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
import { Router } from "@angular/router";

export const ROUTE_EQUIPMENTS = 'equipments';

@Component({
    selector: 'app-list-equipments',
    imports: [shared, FilterEquipmentsComponent],
    templateUrl: './list-equipments.component.html',
    styleUrl: './list-equipments.component.scss',
})
export class ListEquipmentsComponent {
    displayedColumns: string[] = ['Name', 'Amount', 'Update'];
    currentUser = toSignal(this.authService.activeUser);
    equipments = signal<Equipment[] | null>(null);
    searchFilter = signal<FilterEquipmentParam | null>(null)

    constructor(private authService: AuthenticationService, private router: Router, private api: ApiService, private notificationService: NotificationService) {
        effect(() => {
            const search = this.searchFilter();

            if (search?.hospital) {
                this.api.hospitalApi.getEquipmentsByHospital(search.hospital as number, search.name ?? '').pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response => {
                    this.equipments.set(response);
                }))
            } else {
                this.api.hospitalApi.getEquipments(search?.name).pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response => {
                    this.equipments.set(response);
                }))
            }
        });
    }

    searchClicked(filter: FilterEquipmentParam) {
        this.searchFilter.set(filter);
    }

    addEquipment() {
        this.router.navigate([ROUTE_CREATE_EQUIPMENT])
    }
}
