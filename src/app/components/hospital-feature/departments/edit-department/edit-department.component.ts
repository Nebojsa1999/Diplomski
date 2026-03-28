import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Hospital } from "../../../../rest/hospital/hospital.model";
import { ApiService } from "../../../../common/service/api.service";
import { catchError, of } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_DEPARTMENTS } from "../list-departments/list-departments.component";

export const ROUTE_EDIT_DEPARTMENT = 'edit-department';

@Component({
    selector: 'app-edit-department',
    imports: [shared],
    templateUrl: './edit-department.component.html',
    styleUrl: './edit-department.component.scss',
})
export class EditDepartmentComponent {
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
    private hospitalId: number | null = null;

    compareHospitalById = (a: Hospital | null, b: Hospital | null): boolean => {
        if (!a || !b) return a === b;
        return a.id === b.id;
    };

    constructor(private apiService: ApiService, private route: ActivatedRoute, private notificationService: NotificationService, private router: Router, private location: Location) {
        this.form.get('hospital')?.disable();
        const id = this.route.snapshot.params['id'];
        this.apiService.hospitalApi.getDepartment(id).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((department) => {
            this.hospitalId = department?.hospital?.id ?? null;
            this.form.patchValue({
                name: department?.name,
                description: department?.description,
                phoneNumber: department?.phoneNumber,
                hospital: department?.hospital
            });
        });
    }

    onSubmit() {
        const name = this.form.get('name')?.value;
        const description = this.form.get('description')?.value;
        const phoneNumber = this.form.get('phoneNumber')?.value;

        this.apiService.hospitalApi.updateDepartment(this.route.snapshot.params['id'], {
            name: name as string,
            description: description as string,
            phoneNumber: phoneNumber as string,
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully edited department.');
                this.router.navigate([`/hospital/${this.hospitalId}/${ROUTE_DEPARTMENTS}`]);
            }
        });
    }

    goBack() { this.location.back(); }
}
