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
import { ROUTE_MEDICAMENTS } from "../list-medicaments/list-medicaments.component";

export const ROUTE_CREATE_MEDICAMENT = 'create-medicament';

@Component({
    selector: 'app-create-medicament',
    imports: [shared],
    templateUrl: './create-medicament.component.html',
    styleUrl: './create-medicament.component.scss',
})
export class CreateMedicamentComponent {
    form = new FormGroup({
        name: new FormControl<string | null>('', [Validators.required]),
        instructions: new FormControl<string | null>(null, [Validators.required]),
        dosage: new FormControl<string | null>(null, [Validators.required]),
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
        const instructions = this.form.get('instructions')?.value;
        const dosage = this.form.get('dosage')?.value;
        const department = this.form.getRawValue().department;

        this.apiService.hospitalApi.createMedicament((department as Department).id, {
            name: name as string,
            instructions: instructions as string,
            dosage: dosage as string,
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully created medicament.');
                this.router.navigate([`/department/${this.departmentId ?? (department as Department).id}/${ROUTE_MEDICAMENTS}`]);
            }
        });
    }

    goBack() {
        const departmentId = this.departmentId ?? this.form.getRawValue().department?.id;
        if (departmentId) {
            this.router.navigate([`/department/${departmentId}/${ROUTE_MEDICAMENTS}`]);
        } else {
            this.location.back();
        }
    }
}
