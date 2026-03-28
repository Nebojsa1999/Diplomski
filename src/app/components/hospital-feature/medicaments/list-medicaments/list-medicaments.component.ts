import { Component, effect, signal } from '@angular/core';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { Medicament } from "../../../../rest/hospital/hospital.model";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { ApiService } from "../../../../common/service/api.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError } from "rxjs";
import { FilterMedicamentsComponent, FilterMedicamentParam } from "./filter-medicaments/filter-medicaments.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ROUTE_CREATE_MEDICAMENT } from "../create-medicament/create-medicament.component";

export const ROUTE_MEDICAMENTS = 'medicaments';

@Component({
    selector: 'app-list-medicaments',
    imports: [shared, FilterMedicamentsComponent],
    templateUrl: './list-medicaments.component.html',
    styleUrl: './list-medicaments.component.scss',
})
export class ListMedicamentsComponent {
    displayedColumns: string[] = ['Name', 'Dosage', 'Instructions', 'Department', 'Update', 'Delete'];
    currentUser = toSignal(this.authService.activeUser);
    medicaments = signal<Medicament[] | null>(null);
    searchFilter = signal<FilterMedicamentParam | null>(null);
    private departmentId: number | null = null;

    constructor(private authService: AuthenticationService, private router: Router, private route: ActivatedRoute, private api: ApiService, private notificationService: NotificationService, private location: Location) {
        this.departmentId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;

        effect(() => {
            const search = this.searchFilter();
            const departmentId = search?.department ?? this.departmentId ?? undefined;
            this.api.hospitalApi.listMedicaments(search?.name ?? '', departmentId).pipe(
                map(response => response.data),
                catchError(error => this.notificationService.showError(error.message))
            ).subscribe((response => {
                this.medicaments.set(response);
            }));
        });
    }

    searchClicked(filter: FilterMedicamentParam) {
        this.searchFilter.set(filter);
    }

    goBack() { this.location.back(); }

    addMedicament() {
        this.router.navigate([ROUTE_CREATE_MEDICAMENT], {
            queryParams: this.departmentId ? { departmentId: this.departmentId } : {}
        });
    }

    deleteMedicament(id: number) {
        this.api.hospitalApi.deleteMedicament(id).pipe(
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe(() => {
            this.medicaments.update(items => items?.filter(m => m.id !== id) ?? []);
        });
    }
}
