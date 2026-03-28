import { Component, effect, signal } from '@angular/core';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { Department } from "../../../../rest/hospital/hospital.model";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { ApiService } from "../../../../common/service/api.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError } from "rxjs";
import { FilterDepartmentParam, FilterDepartmentsComponent } from "./filter-departments/filter-departments.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_CREATE_DEPARTMENT } from "../create-department/create-department.component";
import { ROUTE_HOSPITALS } from "../../hospitals/list-hospitals/list-hospitals.component";

export const ROUTE_DEPARTMENTS = 'departments';

@Component({
    selector: 'app-list-departments',
    imports: [shared, FilterDepartmentsComponent],
    templateUrl: './list-departments.component.html',
    styleUrl: './list-departments.component.scss',
})
export class ListDepartmentsComponent {
    displayedColumns: string[] = ['Name', 'Description', 'PhoneNumber', 'Hospital', 'Procedures', 'Diagnoses', 'Medicaments', 'Update', 'Delete'];
    currentUser = toSignal(this.authService.activeUser);
    departments = signal<Department[] | null>(null);
    searchFilter = signal<FilterDepartmentParam | null>(null);
    private hospitalId: number | null = null;

    constructor(private authService: AuthenticationService, private router: Router, private route: ActivatedRoute, private api: ApiService, private notificationService: NotificationService) {
        this.hospitalId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;

        effect(() => {
            const search = this.searchFilter();
            const hospitalId = search?.hospital ?? this.hospitalId ?? undefined;
            this.api.hospitalApi.listDepartments(search?.name ?? '', hospitalId).pipe(
                map(response => response.data),
                catchError(error => this.notificationService.showError(error.message))
            ).subscribe((response => {
                this.departments.set(response);
            }));
        });
    }

    searchClicked(filter: FilterDepartmentParam) {
        this.searchFilter.set(filter);
    }

    goBack() {
        this.router.navigate([ROUTE_HOSPITALS]);
    }

    addDepartment() {
        this.router.navigate([ROUTE_CREATE_DEPARTMENT]);
    }

    deleteDepartment(id: number) {
        this.api.hospitalApi.deleteDepartment(id).pipe(
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe(() => {
            this.departments.update(items => items?.filter(d => d.id !== id) ?? []);
        });
    }
}
