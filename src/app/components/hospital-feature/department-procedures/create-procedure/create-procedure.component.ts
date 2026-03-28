import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Department } from "../../../../rest/hospital/hospital.model";
import { ApiService } from "../../../../common/service/api.service";
import { catchError, of } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_PROCEDURES } from "../list-procedures/list-procedures.component";

export const ROUTE_CREATE_PROCEDURE = 'create-procedure';

@Component({
    selector: 'app-create-procedure',
    imports: [shared],
    templateUrl: './create-procedure.component.html',
    styleUrl: './create-procedure.component.scss',
})
export class CreateProcedureComponent {
    form = new FormGroup({
        name: new FormControl<string | null>('', [Validators.required]),
        description: new FormControl<string | null>(null),
        price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        department: new FormControl<Department | null>(null, [Validators.required])
    });
    compareDepartmentById = (a: Department | null, b: Department | null): boolean => {
        if (!a || !b) return a === b;
        return a.id === b.id;
    };

    departments$ = this.apiService.hospitalApi.listDepartments().pipe(
        map(response => response.data),
        catchError(() => of([]))
    );

    private departmentId: number | null = null;

    constructor(private apiService: ApiService, private notificationService: NotificationService, private router: Router, private route: ActivatedRoute, private location: Location) {
        const departmentId = this.route.snapshot.queryParams['departmentId'];
        if (departmentId) {
            this.departmentId = +departmentId;
            this.form.get('department')?.disable();
            this.apiService.hospitalApi.getDepartment(+departmentId).pipe(
                map(response => response.data),
                catchError(() => of(null))
            ).subscribe(department => {
                if (department) this.form.get('department')?.setValue(department);
            });
        }
    }

    onSubmit() {
        const name = this.form.get('name')?.value;
        const description = this.form.get('description')?.value;
        const price = this.form.get('price')?.value;
        const department = this.form.getRawValue().department;

        this.apiService.hospitalApi.createProcedure((department as Department).id, {
            name: name as string,
            description: description as string,
            price: price as number,
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully created procedure.');
                this.router.navigate([`/department/${this.departmentId ?? (department as Department).id}/${ROUTE_PROCEDURES}`]);
            }
        });
    }

    goBack() {
        const departmentId = this.departmentId ?? this.form.getRawValue().department?.id;
        if (departmentId) {
            this.router.navigate([`/department/${departmentId}/${ROUTE_PROCEDURES}`]);
        } else {
            this.location.back();
        }
    }
}
