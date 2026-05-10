import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../common/service/api.service";
import { catchError } from "rxjs";
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
    private departmentNameId: number | null = null;

    form = new FormGroup({
        code: new FormControl<string | null>('', [Validators.required]),
        name: new FormControl<string | null>('', [Validators.required]),
        description: new FormControl<string | null>(null),
        department: new FormControl<string | null>(null)
    });

    constructor(private apiService: ApiService, private route: ActivatedRoute, private notificationService: NotificationService, private router: Router, private location: Location) {
        this.form.get('department')?.disable();
        const id = this.route.snapshot.params['id'];
        this.apiService.hospitalApi.getDiagnosis(id).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((diagnosis) => {
            this.departmentNameId = diagnosis?.departmentName?.id ?? null;
            this.form.patchValue({
                code: diagnosis?.code,
                name: diagnosis?.name,
                description: diagnosis?.description,
                department: diagnosis?.departmentName?.name ?? null
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
                if (this.departmentNameId != null) {
                    this.router.navigate(['department-name', this.departmentNameId, ROUTE_DIAGNOSES]);
                } else {
                    this.router.navigate([ROUTE_DIAGNOSES]);
                }
            }
        });
    }

    goBack() { this.location.back(); }
}
