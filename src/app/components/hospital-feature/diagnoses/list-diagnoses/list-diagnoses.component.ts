import { Component, effect, signal } from '@angular/core';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { Diagnosis } from "../../../../rest/hospital/hospital.model";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { ApiService } from "../../../../common/service/api.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError, of } from "rxjs";
import { FilterDiagnosesComponent, FilterDiagnosisParam } from "./filter-diagnoses/filter-diagnoses.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_CREATE_DIAGNOSIS } from "../create-diagnosis/create-diagnosis.component";
import { ROUTE_DEPARTMENTS } from "../../departments/list-departments/list-departments.component";
import { ROUTE_HOSPITAL } from "../../hospitals/upsert-hospital/hospital.component";
import { ROUTE_DEPARTMENT_NAMES } from "../../department-names/list-department-names/list-department-names.component";

export const ROUTE_DIAGNOSES = 'diagnoses';

@Component({
    selector: 'app-list-diagnoses',
    imports: [shared, FilterDiagnosesComponent],
    templateUrl: './list-diagnoses.component.html',
    styleUrl: './list-diagnoses.component.scss',
})
export class ListDiagnosesComponent {
    displayedColumns: string[] = ['Code', 'Name', 'Description', 'Department', 'Update', 'Delete'];
    currentUser = toSignal(this.authService.activeUser);
    diagnoses = signal<Diagnosis[] | null>(null);
    searchFilter = signal<FilterDiagnosisParam | null>(null);
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
            this.api.hospitalApi.listDiagnoses(search?.name ?? '', deptName).pipe(
                map(response => response.data),
                catchError(error => this.notificationService.showError(error.message))
            ).subscribe((response => {
                this.diagnoses.set(response);
            }));
        });
    }

    searchClicked(filter: FilterDiagnosisParam) {
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

    addDiagnosis() {
        if (this.departmentNameId) {
            this.router.navigate([ROUTE_CREATE_DIAGNOSIS], {
                queryParams: { departmentName: this.departmentName, departmentNameId: this.departmentNameId }
            });
        } else {
            this.router.navigate([ROUTE_CREATE_DIAGNOSIS], {
                queryParams: this.departmentId ? { departmentId: this.departmentId } : {}
            });
        }
    }

    deleteDiagnosis(id: number) {
        this.api.hospitalApi.deleteDiagnosis(id).pipe(
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe(() => {
            this.notificationService.showSuccess('Diagnosis deleted successfully.');
            this.diagnoses.update(items => items?.filter(d => d.id !== id) ?? []);
        });
    }
}
