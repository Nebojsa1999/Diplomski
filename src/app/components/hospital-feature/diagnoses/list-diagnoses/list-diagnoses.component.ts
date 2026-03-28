import { Component, effect, signal } from '@angular/core';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { Diagnosis } from "../../../../rest/hospital/hospital.model";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { ApiService } from "../../../../common/service/api.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError } from "rxjs";
import { FilterDiagnosesComponent, FilterDiagnosisParam } from "./filter-diagnoses/filter-diagnoses.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_CREATE_DIAGNOSIS } from "../create-diagnosis/create-diagnosis.component";

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

    constructor(private authService: AuthenticationService, private router: Router, private route: ActivatedRoute, private api: ApiService, private notificationService: NotificationService) {
        this.departmentId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;

        effect(() => {
            const search = this.searchFilter();
            const departmentId = search?.department ?? this.departmentId ?? undefined;
            this.api.hospitalApi.listDiagnoses(search?.name ?? '', departmentId).pipe(
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

    addDiagnosis() {
        this.router.navigate([ROUTE_CREATE_DIAGNOSIS]);
    }

    deleteDiagnosis(id: number) {
        this.api.hospitalApi.deleteDiagnosis(id).pipe(
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe(() => {
            this.diagnoses.update(items => items?.filter(d => d.id !== id) ?? []);
        });
    }
}
