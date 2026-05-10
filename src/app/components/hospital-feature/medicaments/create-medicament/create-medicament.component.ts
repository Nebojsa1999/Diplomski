import { Component } from '@angular/core';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../common/service/api.service";
import { catchError } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_DEPARTMENT_NAMES } from "../../department-names/list-department-names/list-department-names.component";

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
    });

    private departmentNameId: number | null = null;
    private departmentName: string | null = null;

    constructor(private apiService: ApiService, private notificationService: NotificationService, private route: ActivatedRoute, private router: Router) {
        const departmentNameId = this.route.snapshot.queryParams['departmentNameId'];
        const departmentName = this.route.snapshot.queryParams['departmentName'];
        if (departmentNameId) this.departmentNameId = +departmentNameId;
        if (departmentName) this.departmentName = departmentName;
    }

    onSubmit() {
        if (!this.departmentNameId || !this.departmentName) return;

        this.apiService.hospitalApi.createMedicament({
            name: this.form.get('name')?.value as string,
            instructions: this.form.get('instructions')?.value as string,
            dosage: this.form.get('dosage')?.value as string,
            departmentName: this.departmentName,
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully created medicament.');
                this.router.navigate(['department-name', this.departmentNameId, 'medicaments']);
            }
        });
    }

    goBack() {
        this.router.navigate([ROUTE_DEPARTMENT_NAMES]);
    }
}
