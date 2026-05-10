import { Component, effect, signal } from '@angular/core';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { Medicament } from "../../../../rest/hospital/hospital.model";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { ApiService } from "../../../../common/service/api.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError, of } from "rxjs";
import { FilterMedicamentsComponent, FilterMedicamentParam } from "./filter-medicaments/filter-medicaments.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_CREATE_MEDICAMENT } from "../create-medicament/create-medicament.component";
import { ROUTE_DEPARTMENTS } from "../../departments/list-departments/list-departments.component";
import { ROUTE_HOSPITAL } from "../../hospitals/upsert-hospital/hospital.component";
import { ROUTE_DEPARTMENT_NAMES } from "../../department-names/list-department-names/list-department-names.component";

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
    private departmentNameId: number | null = null;
    private departmentName: string | null = null;
    private departmentLoaded = signal(false);

    constructor(private authService: AuthenticationService, private router: Router, private route: ActivatedRoute, private api: ApiService, private notificationService: NotificationService) {
        const byDepartmentName = this.route.snapshot.data['byDepartmentName'];
        const routeId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;

        if (byDepartmentName && routeId) {
            this.departmentNameId = routeId;
            this.api.hospitalApi.getDepartmentName(this.departmentNameId).pipe(
                map(r => r.data),
                catchError(() => of(null))
            ).subscribe(dn => {
                this.departmentName = dn?.name ?? null;
                this.departmentLoaded.set(true);
            });
        } else {
            this.departmentId = routeId;
            if (this.departmentId) {
                this.api.hospitalApi.getDepartment(this.departmentId).pipe(
                    map(r => r.data),
                    catchError(() => of(null))
                ).subscribe(dept => {
                    this.departmentName = dept?.name ?? null;
                    this.departmentLoaded.set(true);
                });
            } else {
                this.departmentLoaded.set(true);
            }
        }

        effect(() => {
            if (!this.departmentLoaded()) return;
            const search = this.searchFilter();
            const deptName = search?.departmentName ?? this.departmentName ?? undefined;
            this.api.hospitalApi.listMedicaments(search?.name ?? '', deptName).pipe(
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

    goBack() {
        if (this.departmentNameId) {
            this.router.navigate([ROUTE_DEPARTMENT_NAMES]);
            return;
        }
        if (!this.departmentId) return;
        this.api.hospitalApi.getDepartment(this.departmentId).pipe(
            map(r => r.data)
        ).subscribe(dept => {
            if (dept) this.router.navigate([ROUTE_HOSPITAL, dept.hospital.id, ROUTE_DEPARTMENTS]);
        });
    }

    addMedicament() {
        if (this.departmentNameId) {
            this.router.navigate([ROUTE_CREATE_MEDICAMENT], {
                queryParams: { departmentName: this.departmentName, departmentNameId: this.departmentNameId }
            });
        } else {
            this.router.navigate([ROUTE_CREATE_MEDICAMENT], {
                queryParams: this.departmentId ? { departmentId: this.departmentId } : {}
            });
        }
    }

    deleteMedicament(id: number) {
        this.api.hospitalApi.deleteMedicament(id).pipe(
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe(() => {
            this.notificationService.showSuccess('Medicament deleted successfully.');
            this.medicaments.update(items => items?.filter(m => m.id !== id) ?? []);
        });
    }
}
