import { Component, effect, ElementRef, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../common/service/api.service';
import { shared } from "../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../common/service/authentication.service";
import { User } from "../../rest/user/user.model";
import { Appointment, CenterAccount } from "../../rest/center-account/center.account.model";
import { map } from "rxjs/operators";
import { catchError, forkJoin } from "rxjs";
import { NotificationService } from "../../common/service/notification.service";
import { NgxMatTimepickerComponent, NgxMatTimepickerDirective } from "ngx-mat-timepicker";

export const ROUTE_HOSPITAL = 'hospital';

@Component({
    selector: 'app-center-account',
    imports: [shared, NgxMatTimepickerDirective, NgxMatTimepickerComponent],
    templateUrl: './center-account.component.html',
    styleUrls: ['./center-account.component.scss']
})
export class CenterAccountComponent {
    @ViewChild("search", {static: false}) searchElementRef!: ElementRef;
    public searchControl!: FormControl;

    zoom: number = 18;

    // initial center position for the map
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
    displayedColumnsOfAdmins: string[] = ['Name', 'Surname', 'Phone'];
    displayedColumnsOfAppointments: string[] = ['Date', 'Duration', 'AdminOfCenter']
    currentUser = toSignal(this.authService.activeUser);
    admins = signal<User[] | null>(null);
    appointments = signal<Appointment[] | null>(null);
    centerAccount = signal<CenterAccount | null>(null);

    constructor(
        private api: ApiService,
        private authService: AuthenticationService,
        private notificationService: NotificationService
    ) {


        effect(() => {
            const currentUser = this.currentUser();
            if (!currentUser) return;

            const centerId = currentUser.centerAccount.id;

            forkJoin({
                centerAccount: this.api.centerAccountApi.getCenterAccount().pipe(
                    map(resp => resp.data),
                    catchError(error => this.notificationService.showError(error.message))
                ),
                admins: this.api.centerAccountApi.getAdminsOfCenter(centerId).pipe(
                    map(resp => resp.data),
                    catchError(error => this.notificationService.showError(error.message))
                ),
                appointments: this.api.centerAccountApi.getAppointments(centerId).pipe(
                    map(resp => resp.data),
                    catchError(error => this.notificationService.showError(error.message))
                )
            }).subscribe(({centerAccount, admins, appointments}) => {
                if (centerAccount) {
                    this.centerAccount.set(centerAccount);
                    const [h, m] = centerAccount.startTime.split(":");
                    const [h2, m2] = centerAccount.endTime.split(":");

                    this.form.patchValue({
                        name: centerAccount.name ?? '',
                        address: centerAccount.address ?? '',
                        description: centerAccount.description ?? '',
                        startTime: `${h}:${m}`,
                        endTime: `${h2}:${m2}`,
                        latitude: centerAccount.latitude ?? '',
                        longitude: centerAccount.longitude ?? '',
                        country: centerAccount.country ?? '',
                        city: centerAccount.city ?? ''
                    });
                }
                this.admins.set(admins);
                this.appointments.set(appointments);
            });
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

        this.api.centerAccountApi.updateCenterAccount({
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
                this.notificationService.showSuccess("Successfully updated hospital information.")
            }
        });


    }

    protected updateZoom() {

    }
}
