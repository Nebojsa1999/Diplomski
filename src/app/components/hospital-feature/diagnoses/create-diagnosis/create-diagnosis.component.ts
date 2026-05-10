import { Component } from '@angular/core';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../common/service/api.service";
import { catchError } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_DEPARTMENT_NAMES } from "../../department-names/list-department-names/list-department-names.component";

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
    });

    private departmentNameId: number | null = null;
    private departmentName: string | null = null;

    constructor(private apiService: ApiService, private notificationService: NotificationService, private route: ActivatedRoute, private router: Router) {
        const departmentNameId = this.route.snapshot.queryParams['departmentNameId'];
        const departmentName = this.route.snapshot.queryParams['departmentName'];
        if (departmentNameId) this.departmentNameId = +departmentNameId;
        if (departmentName) this.departmentName = departmentName;
    }

    goBack() {
        this.router.navigate([ROUTE_DEPARTMENT_NAMES]);
    }

    onSubmit() {
        if (!this.departmentNameId || !this.departmentName) return;

        this.apiService.hospitalApi.createDiagnosis({
            code: this.form.get('code')?.value as string,
            name: this.form.get('name')?.value as string,
            description: this.form.get('description')?.value as string,
            departmentName: this.departmentName,
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully created diagnosis.');
                this.router.navigate(['department-name', this.departmentNameId, 'diagnoses']);
            }
        });
    }
}
