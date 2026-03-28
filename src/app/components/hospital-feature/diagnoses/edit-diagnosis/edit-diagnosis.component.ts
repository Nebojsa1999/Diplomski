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
import { ROUTE_DIAGNOSES } from "../list-diagnoses/list-diagnoses.component";

export const ROUTE_EDIT_DIAGNOSIS = 'edit-diagnosis';

@Component({
    selector: 'app-edit-diagnosis',
    imports: [shared],
    templateUrl: './edit-diagnosis.component.html',
    styleUrl: './edit-diagnosis.component.scss',
})
export class EditDiagnosisComponent {
    form = new FormGroup({
        code: new FormControl<string | null>('', [Validators.required]),
        name: new FormControl<string | null>('', [Validators.required]),
        description: new FormControl<string | null>(null),
        department: new FormControl<Department | null>(null, [Validators.required])
    });
    departments$ = this.apiService.hospitalApi.listDepartments().pipe(
        map(response => response.data),
        catchError(() => of([]))
    );

    compareDepartmentById = (a: Department | null, b: Department | null): boolean => {
        if (!a || !b) return a === b;
        return a.id === b.id;
    };

    constructor(private apiService: ApiService, private route: ActivatedRoute, private notificationService: NotificationService, private router: Router, private location: Location) {
        this.form.get('department')?.disable();
        const id = this.route.snapshot.params['id'];
        this.apiService.hospitalApi.getDiagnosis(id).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((diagnosis) => {
            this.form.patchValue({
                code: diagnosis?.code,
                name: diagnosis?.name,
                description: diagnosis?.description,
                department: diagnosis?.department
            });
        });
    }

    onSubmit() {
        const code = this.form.get('code')?.value;
        const name = this.form.get('name')?.value;
        const description = this.form.get('description')?.value;

        this.apiService.hospitalApi.updateDiagnosis(this.route.snapshot.params['id'], {
            code: code as string,
            name: name as string,
            description: description as string,
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully edited diagnosis.');
                this.router.navigate([ROUTE_DIAGNOSES]);
            }
        });
    }

    goBack() { this.location.back(); }
}
