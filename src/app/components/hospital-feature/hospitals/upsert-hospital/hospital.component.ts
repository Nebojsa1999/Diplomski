import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../common/service/api.service';
import { shared } from "../../../../app.config";
import { Appointment, Hospital } from "../../../../rest/hospital/hospital.model";
import { map } from "rxjs/operators";
import { catchError, forkJoin } from "rxjs";
import { NotificationService } from "../../../../common/service/notification.service";
import { NgxMatTimepickerComponent, NgxMatTimepickerDirective } from "ngx-mat-timepicker";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_HOSPITALS } from "../list-hospitals/list-hospitals.component";

export const ROUTE_HOSPITAL = `hospital`;

@Component({
    selector: 'app-hospital',
    imports: [shared, NgxMatTimepickerDirective, NgxMatTimepickerComponent],
    templateUrl: './hospital.component.html',
    styleUrls: ['./hospital.component.scss']
})
export class HospitalComponent {

    latitude: number = 41.87811360000001;
    longitude: number = 12.4922651;

    form: FormGroup = new FormGroup({
        name: new FormControl<string | null>(null, [Validators.required]),
        address: new FormControl<string | null>(null, [Validators.required]),
        description: new FormControl<string | null>(null),
        startTime: new FormControl<string | null>(null, [Validators.required]),
        endTime: new FormControl<string | null>(null, [Validators.required]),
        latitude: new FormControl<number | null>(null),
        longitude: new FormControl<number | null>(null),
        country: new FormControl<string | null>(null, [Validators.required]),
        city: new FormControl<string | null>(null, [Validators.required]),
    });
    displayedColumnsOfAppointments: string[] = ['Date', 'Duration', 'Doctor']
    appointments = signal<Appointment[] | null>(null);
    hospital = signal<Hospital | null>(null);

    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private notificationService: NotificationService
    ) {
        const id = this.route.snapshot.params['id']

        forkJoin({
            hospital: this.api.hospitalApi.getHospital(id as number).pipe(
                map(resp => resp.data),
                catchError(error => this.notificationService.showError(error.message))
            ),
            appointments: this.api.appointmentApi.getAppointments(id).pipe(
                map(resp => resp.data),
                catchError(error => this.notificationService.showError(error.message))
            )
        }).subscribe(({hospital: hospital, appointments}) => {
            if (hospital) {
                this.hospital.set(hospital);
                const [h, m] = hospital.startTime.split(":");
                const [h2, m2] = hospital.endTime.split(":");

                this.form.patchValue({
                    name: hospital.name ?? '',
                    address: hospital.address ?? '',
                    description: hospital.description ?? '',
                    startTime: `${h}:${m}`,
                    endTime: `${h2}:${m2}`,
                    latitude: hospital.latitude ?? '',
                    longitude: hospital.longitude ?? '',
                    country: hospital.country ?? '',
                    city: hospital.city ?? ''
                });
            }
            this.appointments.set(appointments);
        });
    }

    onSubmit() {
        const [h, m] = this.form.get('startTime')?.value.split(":");
        const [h2, m2] = this.form.get('endTime')?.value.split(":");

        const name = this.form.get('name')?.value;
        const address = this.form.get('address')?.value;
        const description = this.form.get('description')?.value;
        const startTime = `${h}:${m}`;
        const endTime = `${h2}:${m2}`;
        const latitude = this.form.get('latitude')?.value;
        const longitude = this.form.get('longitude')?.value;
        const city = this.form.get('city')?.value;
        const country = this.form.get('country')?.value;

        this.api.hospitalApi.updateHospital(this.route.snapshot.params['id'], {
            name: name,
            address: address,
            description: description,
            startTime: startTime,
            endTime: endTime,
            latitude: latitude,
            longitude: longitude,
            city: city,
            country: country,
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe((response) => {
            if (response) {
                this.router.navigate([ROUTE_HOSPITALS]);
                this.notificationService.showSuccess("Successfully updated hospital information.");
            }
        });
    }
}
