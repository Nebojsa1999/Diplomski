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

export const ROUTE_EDIT_MEDICAMENT = 'edit-medicament';

@Component({
    selector: 'app-edit-medicament',
    imports: [shared],
    templateUrl: './edit-medicament.component.html',
    styleUrl: './edit-medicament.component.scss',
})
export class EditMedicamentComponent {
    form = new FormGroup({
        name: new FormControl<string | null>('', [Validators.required]),
        instructions: new FormControl<string | null>(null, [Validators.required]),
        dosage: new FormControl<string | null>(null, [Validators.required]),
        department: new FormControl<Department | null>(null, [Validators.required])
    });
    departments$ = this.apiService.hospitalApi.listDepartments().pipe(
        map(response => response.data),
        catchError(() => of([]))
    );
    private departmentId: number | null = null;

    compareDepartmentById = (a: Department | null, b: Department | null): boolean => {
        if (!a || !b) return a === b;
        return a.id === b.id;
    };

    constructor(private apiService: ApiService, private route: ActivatedRoute, private notificationService: NotificationService, private router: Router, private location: Location) {
        this.form.get('department')?.disable();
        const id = this.route.snapshot.params['id'];
        this.apiService.hospitalApi.getMedicament(id).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((medicament) => {
            this.departmentId = medicament?.department?.id ?? null;
            this.form.patchValue({
                name: medicament?.name,
                instructions: medicament?.instructions,
                dosage: medicament?.dosage,
                department: medicament?.department
            });
        });
    }

    onSubmit() {
        const name = this.form.get('name')?.value;
        const instructions = this.form.get('instructions')?.value;
        const dosage = this.form.get('dosage')?.value;

        this.apiService.hospitalApi.updateMedicament(this.route.snapshot.params['id'], {
            name: name as string,
            instructions: instructions as string,
            dosage: dosage as string,
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully edited medicament.');
                this.router.navigate([`/department/${this.departmentId}/${ROUTE_MEDICAMENTS}`]);
            }
        });
    }

    goBack() { this.location.back(); }
}
