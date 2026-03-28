import { Component, effect, signal } from '@angular/core';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { DepartmentProcedure } from "../../../../rest/hospital/hospital.model";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { ApiService } from "../../../../common/service/api.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError } from "rxjs";
import { FilterProceduresComponent, FilterProcedureParam } from "./filter-procedures/filter-procedures.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ROUTE_CREATE_PROCEDURE } from "../create-procedure/create-procedure.component";

export const ROUTE_PROCEDURES = 'procedures';

@Component({
    selector: 'app-list-procedures',
    imports: [shared, FilterProceduresComponent],
    templateUrl: './list-procedures.component.html',
    styleUrl: './list-procedures.component.scss',
})
export class ListProceduresComponent {
    displayedColumns: string[] = ['Name', 'Description', 'Price', 'Department', 'Update', 'Delete'];
    currentUser = toSignal(this.authService.activeUser);
    procedures = signal<DepartmentProcedure[] | null>(null);
    searchFilter = signal<FilterProcedureParam | null>(null);
    private departmentId: number | null = null;

    constructor(private authService: AuthenticationService, private router: Router, private route: ActivatedRoute, private api: ApiService, private notificationService: NotificationService, private location: Location) {
        this.departmentId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;

        effect(() => {
            const search = this.searchFilter();
            const departmentId = search?.department ?? this.departmentId ?? undefined;
            this.api.hospitalApi.listProcedures(search?.name ?? '', departmentId).pipe(
                map(response => response.data),
                catchError(error => this.notificationService.showError(error.message))
            ).subscribe((response => {
                this.procedures.set(response);
            }));
        });
    }

    searchClicked(filter: FilterProcedureParam) {
        this.searchFilter.set(filter);
    }

    goBack() { this.location.back(); }

    addProcedure() {
        this.router.navigate([ROUTE_CREATE_PROCEDURE], {
            queryParams: this.departmentId ? { departmentId: this.departmentId } : {}
        });
    }

    deleteProcedure(id: number) {
        this.api.hospitalApi.deleteProcedure(id).pipe(
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe(() => {
            this.procedures.update(items => items?.filter(p => p.id !== id) ?? []);
        });
    }
}
