import { Component } from '@angular/core';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../common/service/api.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { catchError } from "rxjs";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_APPOINTMENTS } from "../../appointments/list-appointments/list-appointments.component";
import { ROUTE_CREATE_ROOM_BOOKING } from "../../room-bookings/create-room-booking/create-room-booking.component";

export const ROUTE_CREATE_MEDICATION = 'create-medication';

@Component({
    selector: 'app-create-medication',
    imports: [shared],
    templateUrl: './create-medication.component.html',
    styleUrl: './create-medication.component.scss',
})
export class CreateMedicationComponent {
    form = new FormGroup({
        notes: new FormControl<string | null>(null, [Validators.required]),
        name: new FormControl<string | null>(null, [Validators.required]),
        dosage: new FormControl<string | null>(null, [Validators.required]),
        frequency: new FormControl<string | null>(null, [Validators.required]),
        instructions: new FormControl<string | null>(null, [Validators.required])
    });
    currentUser = toSignal(this.authService.activeUser);

    constructor(private apiService: ApiService,
                private authService: AuthenticationService,
                private route: ActivatedRoute,
                private router: Router,
                private notificationService: NotificationService) {
    }

    onSubmit(shouldBookRoom: boolean) {
        const notes = this.form.get('notes')?.value;
        const name = this.form.get('name')?.value;
        const dosage = this.form.get('dosage')?.value;
        const frequency = this.form.get('frequency')?.value;
        const instructions = this.form.get('instructions')?.value;

        this.apiService.appointmentApi.createMedication(this.route.snapshot.params['id'], {
            notes: notes as string,
            name: name as string,
            dosage: dosage as string,
            frequency: frequency as string,
            instructions: instructions as string
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response && !shouldBookRoom) {
                this.notificationService.showSuccess('Successfully created prescription.');
                this.router.navigate([ROUTE_APPOINTMENTS])
            }
            else if (response && shouldBookRoom) {
                this.notificationService.showSuccess('Successfully created prescription.');
                this.router.navigate([this.route.snapshot.params['id'], ROUTE_CREATE_ROOM_BOOKING])
            }
        })
    }
}
