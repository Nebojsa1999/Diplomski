import { Component, signal } from '@angular/core';
import { Location } from '@angular/common';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../common/service/api.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { catchError, of } from "rxjs";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_APPOINTMENTS } from "../../appointments/list-appointments/list-appointments.component";
import { ROUTE_CREATE_ROOM_BOOKING } from "../../room-bookings/create-room-booking/create-room-booking.component";
import { Medicament } from "../../../../rest/hospital/hospital.model";

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
        medicamentId: new FormControl<number | null>(null),
        dosage: new FormControl<string | null>(null, [Validators.required]),
        frequency: new FormControl<string | null>(null, [Validators.required]),
        instructions: new FormControl<string | null>(null, [Validators.required])
    });
    currentUser = toSignal(this.authService.activeUser);
    medicaments = signal<Medicament[]>([]);

    constructor(private apiService: ApiService,
                private authService: AuthenticationService,
                private route: ActivatedRoute,
                private router: Router,
                private notificationService: NotificationService,
                private location: Location) {
        const appointmentId = this.route.snapshot.params['id'];
        this.apiService.appointmentApi.getAppointment(appointmentId).pipe(
            map(r => r.data),
            catchError(() => of(null))
        ).subscribe(appointment => {
            const departmentName = appointment?.doctor?.department?.name;
            this.apiService.hospitalApi.listMedicaments(undefined, departmentName).pipe(
                map(r => r.data ?? []),
                catchError(() => of([]))
            ).subscribe(m => this.medicaments.set(m));
        });

        this.form.get('name')!.valueChanges.subscribe(selectedName => {
            const med = this.medicaments().find(m => m.name === selectedName);
            if (med) {
                this.form.patchValue({
                    medicamentId: med.id,
                    dosage: med.dosage,
                    instructions: med.instructions
                }, { emitEvent: false });
            }
        });
    }

    goBack() { this.location.back(); }

    onSubmit(shouldBookRoom: boolean) {
        const notes = this.form.get('notes')?.value;
        const name = this.form.get('name')?.value;
        const dosage = this.form.get('dosage')?.value;
        const frequency = this.form.get('frequency')?.value;
        const instructions = this.form.get('instructions')?.value;

        const medicamentId = this.form.get('medicamentId')?.value;

        this.apiService.appointmentApi.createMedication(this.route.snapshot.params['id'], {
            notes: notes as string,
            name: name as string,
            dosage: dosage as string,
            frequency: frequency as string,
            instructions: instructions as string,
            medicamentId: medicamentId ?? undefined,
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
