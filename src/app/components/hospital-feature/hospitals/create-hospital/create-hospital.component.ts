import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { shared } from "../../../../app.config";
import { ApiService } from "../../../../common/service/api.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../../../common/service/notification.service";
import { catchError } from "rxjs";
import { map } from "rxjs/operators";
import { ROUTE_HOSPITALS } from "../list-hospitals/list-hospitals.component";
import { NgxMatTimepickerComponent, NgxMatTimepickerDirective } from "ngx-mat-timepicker";

export const ROUTE_CREATE_HOSPITAL = `create-hospital`;

@Component({
    selector: 'app-create-hospital',
    imports: [
        shared,
        NgxMatTimepickerComponent,
        NgxMatTimepickerDirective,
    ],
    templateUrl: './create-hospital.component.html',
    styleUrl: './create-hospital.component.scss',
})
export class CreateHospitalComponent {
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

    constructor(
        private api: ApiService,
        private router: Router,
        private notificationService: NotificationService
    ) {
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

        this.api.hospitalApi.createHospital({
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
                this.notificationService.showSuccess("Successfully created hospital.");
            }
        });
    }
}
