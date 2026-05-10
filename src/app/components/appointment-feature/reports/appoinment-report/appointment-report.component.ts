import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../common/service/api.service';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { BloodType, Diagnosis, RhFactor } from "../../../../rest/hospital/hospital.model";
import { map } from "rxjs/operators";
import { catchError, of } from "rxjs";
import { NotificationService } from "../../../../common/service/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_CREATE_MEDICATION } from "../create-medication/create-medication.component";
import { ROUTE_APPOINTMENTS } from "../../appointments/list-appointments/list-appointments.component";

export const ROUTE_APPOINTMENT_REPORT = 'appointment-report';

@Component({
    selector: 'app-appointment-report',
    imports: [shared],
    templateUrl: './appointment-report.component.html',
    styleUrls: ['./appointment-report.component.scss']
})
export class AppointmentReportComponent {
    form = new FormGroup({
        bloodType: new FormControl<string>('', Validators.required),
        rhFactor: new FormControl<string>(''),
        heightCm: new FormControl<number | null>(null),
        weightKg: new FormControl<number | null>(null),
        chronicDiseases: new FormControl<string>(''),
        previousHospitalization: new FormControl<string>(''),
        previousSurgeries: new FormControl<string>(''),
        allergies: new FormControl<string>(''),
        familyHistory: new FormControl<string>(''),
        longThermTherapy: new FormControl<string>(''),
        specificContradictions: new FormControl<string>(''),
        bloodPressure: new FormControl<string>('', Validators.required),
        hearthRate: new FormControl<string>('', Validators.required),
        diagnosis: new FormControl<string>('', Validators.required),
        doctorsComment: new FormControl<string>(''),
    });

    currentUser = toSignal(this.authService.activeUser);
    diagnoses = signal<Diagnosis[]>([]);
    isLoading = signal(false);
    bloodTypes = Object.values(BloodType);
    rhFactors = Object.values(RhFactor);

    constructor(
        private authService: AuthenticationService,
        private notificationService: NotificationService,
        private api: ApiService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        const appointmentId = this.route.snapshot.params['id'];
        this.api.appointmentApi.getAppointment(appointmentId).pipe(
            map(r => r.data),
            catchError(() => of(null))
        ).subscribe(appointment => {
            const departmentName = appointment?.doctor?.department?.name;
            this.api.hospitalApi.listDiagnoses(undefined, departmentName).pipe(
                map(r => r.data ?? []),
                catchError(() => of([]))
            ).subscribe(d => this.diagnoses.set(d as Diagnosis[]));

            if (!appointment?.patient?.id) return;
            this.api.hospitalApi.getMedicalRecordByPatient(appointment.patient.id).pipe(
                map(r => r.data),
                catchError(() => of(null))
            ).subscribe(record => {
                if (!record) return;
                this.form.patchValue({
                    bloodType: record.bloodType,
                    rhFactor: record.rhFactor,
                    heightCm: record.heightCm,
                    weightKg: record.weightKg,
                    chronicDiseases: record.chronicDiseases ?? '',
                    previousHospitalization: record.previousHospitalization ?? '',
                    previousSurgeries: record.previousSurgeries ?? '',
                    allergies: record.allergies ?? '',
                    familyHistory: record.familyHistory ?? '',
                    longThermTherapy: record.longTermTherapy ?? '',
                    specificContradictions: record.specificContradictions ?? '',
                });
            });
        });
    }

    onSubmit(goToPrescription: boolean) {
        this.isLoading.set(true);
        const formValue = this.form.value;

        this.api.appointmentApi.createAppointmentReport(this.route.snapshot.params['id'], {
            bloodType: formValue.bloodType as BloodType,
            rhFactor: formValue.rhFactor as string,
            heightCm: formValue.heightCm as number,
            weightKg: formValue.weightKg as number,
            chronicDiseases: formValue.chronicDiseases as string,
            previousHospitalization: formValue.previousHospitalization as string,
            previousSurgeries: formValue.previousSurgeries as string,
            allergies: formValue.allergies as string,
            familyHistory: formValue.familyHistory as string,
            longThermTherapy: formValue.longThermTherapy as string,
            specificContradictions: formValue.specificContradictions as string,
            bloodPressure: formValue.bloodPressure as string,
            hearthRate: formValue.hearthRate as string,
            diagnosis: formValue.diagnosis as string,
            doctorsComment: formValue.doctorsComment as string,
        }).pipe(
            map(response => response.data),
            catchError((error) => {
                this.isLoading.set(false);
                return this.notificationService.showError(error);
            })
        ).subscribe((response) => {
            this.isLoading.set(false);
            if (response) {
                this.notificationService.showSuccess("Successfully created report.");
                if (goToPrescription) {
                    this.router.navigate([this.route.snapshot.params['id'], ROUTE_CREATE_MEDICATION]);
                } else {
                    this.router.navigate([ROUTE_APPOINTMENTS]);
                }
            }
        });
    }
}
