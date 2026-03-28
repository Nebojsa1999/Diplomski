import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Hospital } from "../../../../rest/hospital/hospital.model";
import { ApiService } from "../../../../common/service/api.service";
import { catchError, of } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { Router } from "@angular/router";
import { ROUTE_DEPARTMENTS } from "../list-departments/list-departments.component";

export const ROUTE_CREATE_DEPARTMENT = 'create-department';

@Component({
    selector: 'app-create-department',
    imports: [shared],
    templateUrl: './create-department.component.html',
    styleUrl: './create-department.component.scss',
})
export class CreateDepartmentComponent {
    form = new FormGroup({
        name: new FormControl<string | null>('', [Validators.required]),
        description: new FormControl<string | null>(null),
        phoneNumber: new FormControl<string | null>(null, [Validators.required]),
        hospital: new FormControl<Hospital | null>(null, [Validators.required])
    });
    hospitals$ = this.apiService.hospitalApi.list().pipe(
        map(response => response.data),
        catchError(() => of([]))
    );

    constructor(private apiService: ApiService, private notificationService: NotificationService, private router: Router, private location: Location) {
    }

    goBack() { this.location.back(); }

    onSubmit() {
        const name = this.form.get('name')?.value;
        const description = this.form.get('description')?.value;
        const phoneNumber = this.form.get('phoneNumber')?.value;
        const hospital = this.form.get('hospital')?.value;

        this.apiService.hospitalApi.createDepartment((hospital as Hospital).id
            , {
                name: name as string,
                description: description as string,
                phoneNumber: phoneNumber as string,
            }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully created department.');
                this.router.navigate([ROUTE_DEPARTMENTS]);
            }
        });
    }
}
