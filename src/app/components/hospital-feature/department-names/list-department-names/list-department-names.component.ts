import { Component, signal } from '@angular/core';
import { shared } from "../../../../app.config";
import { DepartmentName } from "../../../../rest/hospital/hospital.model";
import { ApiService } from "../../../../common/service/api.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError } from "rxjs";

export const ROUTE_DEPARTMENT_NAMES = 'department-names';

@Component({
    selector: 'app-list-department-names',
    imports: [shared],
    templateUrl: './list-department-names.component.html',
    styleUrl: './list-department-names.component.scss',
})
export class ListDepartmentNamesComponent {
    displayedColumns = ['Name', 'Diagnoses', 'Medicaments'];
    departmentNames = signal<DepartmentName[] | null>(null);

    constructor(private api: ApiService, private notificationService: NotificationService) {
        this.api.hospitalApi.listDepartmentNames().pipe(
            map(r => r.data),
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe(data => this.departmentNames.set(data));
    }
}
