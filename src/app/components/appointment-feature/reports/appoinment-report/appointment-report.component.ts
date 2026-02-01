import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../common/service/api.service';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { BloodType, Equipment } from "../../../../rest/hospital/hospital.model";
import { map } from "rxjs/operators";
import { catchError } from "rxjs";
import { NotificationService } from "../../../../common/service/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_CREATE_MEDICATION } from "../create-medication/create-medication.component";
import { TranslateService } from "@ngx-translate/core";

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
        pastMedicalHistory: new FormControl<string>('', Validators.required),
        allergies: new FormControl<string>('', Validators.required),
        familyHistory: new FormControl<string>('', Validators.required),
        bloodPressure: new FormControl<string>('', Validators.required),
        hearthRate: new FormControl<string>('', Validators.required),
        diagnosis: new FormControl<string>('', Validators.required),
    })
    currentUser = toSignal(this.authService.activeUser);
    equipment = signal<Equipment[] | null>(null);

    constructor(
        private authService: AuthenticationService,
        private notificationService: NotificationService,
        private api: ApiService,
        private translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    onSubmit() {
        const bloodType = this.form.get('bloodType')?.value;
        const pastMedicalHistory = this.form.get('pastMedicalHistory')?.value;
        const allergies = this.form.get('allergies')?.value;
        const familyHistory = this.form.get('familyHistory')?.value;
        const bloodPressure = this.form.get('bloodPressure')?.value;
        const hearthRate = this.form.get('hearthRate')?.value;
        const diagnosis = this.form.get('diagnosis')?.value;
        this.api.appointmentApi.createAppointmentReport(this.route.snapshot.params['id'], {
            bloodType: bloodType as BloodType,
            pastMedicalHistory: pastMedicalHistory as string,
            allergies: allergies as string,
            familyHistory: familyHistory as string,
            bloodPressure: bloodPressure as string,
            hearthRate: hearthRate as string,
            diagnosis: diagnosis as string,
        }).pipe(
            map(response => response.data),
            catchError((error) => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess("Successfully created report.");
                this.router.navigate([this.route.snapshot.params['id'], ROUTE_CREATE_MEDICATION])
            }
        });
    }
}

