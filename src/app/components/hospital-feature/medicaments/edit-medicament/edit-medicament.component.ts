import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../common/service/api.service";
import { catchError } from "rxjs";
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
        department: new FormControl<string | null>(null)
    });
    private departmentNameId: number | null = null;

    constructor(private apiService: ApiService, private route: ActivatedRoute, private notificationService: NotificationService, private router: Router, private location: Location) {
        this.form.get('department')?.disable();
        const id = this.route.snapshot.params['id'];
        this.apiService.hospitalApi.getMedicament(id).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((medicament) => {
            this.departmentNameId = medicament?.departmentName?.id ?? null;
            this.form.patchValue({
                name: medicament?.name,
                instructions: medicament?.instructions,
                dosage: medicament?.dosage,
                department: medicament?.departmentName?.name ?? null
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
                this.router.navigate([`/department-name/${this.departmentNameId}/${ROUTE_MEDICAMENTS}`]);
            }
        });
    }

    goBack() { this.location.back(); }
}
