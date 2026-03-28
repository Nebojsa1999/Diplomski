import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Department } from "../../../../rest/hospital/hospital.model";
import { ApiService } from "../../../../common/service/api.service";
import { catchError, of } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { Router } from "@angular/router";
import { ROUTE_DIAGNOSES } from "../list-diagnoses/list-diagnoses.component";

export const ROUTE_CREATE_DIAGNOSIS = 'create-diagnosis';

@Component({
    selector: 'app-create-diagnosis',
    imports: [shared],
    templateUrl: './create-diagnosis.component.html',
    styleUrl: './create-diagnosis.component.scss',
})
export class CreateDiagnosisComponent {
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

    constructor(private apiService: ApiService, private notificationService: NotificationService, private router: Router, private location: Location) {
    }

    goBack() { this.location.back(); }

    onSubmit() {
        const code = this.form.get('code')?.value;
        const name = this.form.get('name')?.value;
        const description = this.form.get('description')?.value;
        const department = this.form.get('department')?.value;

        this.apiService.hospitalApi.createDiagnosis((department as Department).id, {
            code: code as string,
            name: name as string,
            description: description as string,
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully created diagnosis.');
                this.router.navigate([ROUTE_DIAGNOSES]);
            }
        });
    }
}
