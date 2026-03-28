import { Component } from '@angular/core';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BloodType, RhFactor } from "../../../../rest/hospital/hospital.model";
import { ApiService } from "../../../../common/service/api.service";
import { catchError, of } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_USERS } from "../../users/list-users/list-users.component";

export const ROUTE_UPSERT_MEDICAL_RECORD = 'medical-record';

@Component({
    selector: 'app-upsert-medical-record',
    imports: [shared],
    templateUrl: './upsert-medical-record.component.html',
    styleUrl: './upsert-medical-record.component.scss',
})
export class UpsertMedicalRecordComponent {
    bloodTypes = Object.values(BloodType);
    rhFactors = Object.values(RhFactor);
    private recordId: number | null = null;
    firstName: string = '';
    lastName: string = '';

    form = new FormGroup({
        bloodType: new FormControl<BloodType | null>(null, [Validators.required]),
        rhFactor: new FormControl<RhFactor | null>(null, [Validators.required]),
        heightCm: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(300)]),
        weightKg: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(500)]),
        chronicDiseases: new FormControl<string | null>(null),
        previousHospitalization: new FormControl<string | null>(null),
        previousSurgeries: new FormControl<string | null>(null),
        familyHistory: new FormControl<string | null>(null),
        allergies: new FormControl<string | null>(null),
        longTermTherapy: new FormControl<string | null>(null),
        specificContradictions: new FormControl<string | null>(null),
    });

    constructor(private apiService: ApiService, private notificationService: NotificationService, private route: ActivatedRoute, private router: Router) {
        const state = this.router.lastSuccessfulNavigation?.extras?.state;
        this.firstName = state?.['firstName'] ?? '';
        this.lastName = state?.['lastName'] ?? '';

        const patientId = +this.route.snapshot.params['id'];
        this.apiService.hospitalApi.getMedicalRecordByPatient(patientId).pipe(
            map(r => r.data),
            catchError(() => of(null))
        ).subscribe(record => {
            if (record) {
                this.recordId = record.id;
                if (!this.firstName) this.firstName = record.firstName;
                if (!this.lastName) this.lastName = record.lastName;
                this.form.patchValue({
                    bloodType: record.bloodType,
                    rhFactor: record.rhFactor,
                    heightCm: record.heightCm,
                    weightKg: record.weightKg,
                    chronicDiseases: record.chronicDiseases,
                    previousHospitalization: record.previousHospitalization,
                    previousSurgeries: record.previousSurgeries,
                    familyHistory: record.familyHistory,
                    allergies: record.allergies,
                    longTermTherapy: record.longTermTherapy,
                    specificContradictions: record.specificContradictions,
                });
            }
        });
    }

    goBack() {
        this.router.navigate([ROUTE_USERS]);
    }

    onSubmit() {
        const patientId = +this.route.snapshot.params['id'];
        const dto = {
            bloodType: this.form.get('bloodType')?.value as BloodType,
            rhFactor: this.form.get('rhFactor')?.value as RhFactor,
            heightCm: this.form.get('heightCm')?.value as number,
            weightKg: this.form.get('weightKg')?.value as number,
            chronicDiseases: this.form.get('chronicDiseases')?.value as string,
            previousHospitalization: this.form.get('previousHospitalization')?.value as string,
            previousSurgeries: this.form.get('previousSurgeries')?.value as string,
            familyHistory: this.form.get('familyHistory')?.value as string,
            allergies: this.form.get('allergies')?.value as string,
            longTermTherapy: this.form.get('longTermTherapy')?.value as string,
            specificContradictions: this.form.get('specificContradictions')?.value as string,
        };

        const request$ = this.recordId
            ? this.apiService.hospitalApi.updateMedicalRecord(this.recordId, dto)
            : this.apiService.hospitalApi.createMedicalRecord(patientId as number, dto);

        request$.pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.recordId = response.id;
                this.form.markAsPristine();
                this.notificationService.showSuccess('Medical record saved successfully.');
            }
        });
    }
}
