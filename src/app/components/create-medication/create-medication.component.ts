import { Component } from '@angular/core';
import { shared } from "../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../rest/user/user.model";
import { ApiService } from "../../common/service/api.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../common/service/authentication.service";
import { catchError } from "rxjs";
import { NotificationService } from "../../common/service/notification.service";
import { map } from "rxjs/operators";

export const ROUTE_CREATE_MEDICATION = 'create-medication';

@Component({
    selector: 'app-create-medication',
    imports: [shared],
    templateUrl: './create-medication.component.html',
    styleUrl: './create-medication.component.scss',
})
export class CreateMedicationComponent {
    form = new FormGroup({
        patient: new FormControl<User | null>(null, [Validators.required]),
        doctor: new FormControl<User | null>(null, [Validators.required]),
        notes: new FormControl<string | null>(null, [Validators.required]),
        name: new FormControl<string | null>(null, [Validators.required]),
        dosage: new FormControl<string | null>(null, [Validators.required]),
        frequency: new FormControl<string | null>(null, [Validators.required]),
        instructions: new FormControl<string | null>(null, [Validators.required])
    });
    currentUser = toSignal(this.authService.activeUser);

    constructor(private apiService: ApiService, private authService: AuthenticationService, private notificationService: NotificationService) {
    }

    onSubmit() {
        const patient = this.form.get('patient')?.value;
        const doctor = this.form.get('doctor')?.value;
        const notes = this.form.get('notes')?.value;
        const name = this.form.get('name')?.value;
        const dosage = this.form.get('dosage')?.value;
        const frequency = this.form.get('frequency')?.value;
        const instructions = this.form.get('instructions')?.value;

        this.apiService.appointmentApi.createPrescription({
            prescription: {
                doctor: doctor as User,
                patient: patient as User,
                notes: notes as string
            },
            medication: {
                name: name as string,
                dosage: dosage as string,
                frequency: frequency as string,
                instructions: instructions as string
            }
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe()
    }
}
