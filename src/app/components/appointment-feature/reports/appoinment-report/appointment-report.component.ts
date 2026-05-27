import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../common/service/api.service';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { Appointment, Diagnosis } from "../../../../rest/hospital/hospital.model";
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
        anamnesis: new FormControl<string>(''),
        chronicDiseases: new FormControl<string>(''),
        allergies: new FormControl<string>(''),
        longThermTherapy: new FormControl<string>(''),
        bloodPressure: new FormControl<string>(''),
        hearthRate: new FormControl<string>(''),
        diagnosis: new FormControl<string>('', Validators.required),
        doctorsComment: new FormControl<string>(''),
        nextControl: new FormControl<string>(''),
    });

    currentUser = toSignal(this.authService.activeUser);
    diagnoses = signal<Diagnosis[]>([]);
    appointment = signal<Appointment | null>(null);
    isLoading = signal(false);

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
            this.appointment.set(appointment);
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
                    chronicDiseases: record.chronicDiseases ?? '',
                    allergies: record.allergies ?? '',
                    longThermTherapy: record.longTermTherapy ?? '',
                });
            });
        });
    }

    onSubmit(goToPrescription: boolean) {
        this.isLoading.set(true);
        const formValue = this.form.value;

        this.api.appointmentApi.createAppointmentReport(this.route.snapshot.params['id'], {
            anamnesis: formValue.anamnesis as string,
            chronicDiseases: formValue.chronicDiseases as string,
            allergies: formValue.allergies as string,
            longThermTherapy: formValue.longThermTherapy as string,
            bloodPressure: formValue.bloodPressure as string,
            hearthRate: formValue.hearthRate as string,
            diagnosis: formValue.diagnosis as string,
            doctorsComment: formValue.doctorsComment as string,
            nextControl: formValue.nextControl as string,
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
