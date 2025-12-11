import { Component, effect, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../common/service/api.service';
import { shared } from "../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../common/service/authentication.service";
import { Equipment } from "../../rest/center-account/center.account.model";
import { map } from "rxjs/operators";
import { catchError } from "rxjs";
import { NotificationService } from "../../common/service/notification.service";

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
        bloodAmount: new FormControl<string>('', Validators.required),
        noteToDoctor: new FormControl<string>('', Validators.required),
        copperSulfate: new FormControl<string>('', Validators.required),
        haemoglobinometer: new FormControl<string>('', Validators.required),
        lungs: new FormControl<string>('', Validators.required),
        heart: new FormControl<string>('', Validators.required),
        TA: new FormControl<string>('', Validators.required),
        TT: new FormControl<string>('', Validators.required),
        TV: new FormControl<string>('', Validators.required),
        bagType: new FormControl<string>('', Validators.required),
        note: new FormControl<string>('', Validators.required),
        punctureSite: new FormControl<string>('', Validators.required),
        startOfGiving: new FormControl<string>('', Validators.required),
        endOfGiving: new FormControl<string>('', Validators.required),
        reasonForPrematureTerminationOfBloodDonation: new FormControl<string>('', Validators.required),
        equipment: new FormControl<string>('', Validators.required),
        equipmentAmount: new FormControl<string>('', Validators.required),
        denied: new FormControl<string>('', Validators.required),
        reasonForDenying: new FormControl<string>('', Validators.required)
    })
    currentUser = toSignal(this.authService.activeUser);
    equipment = signal<Equipment[] | null>(null);

    constructor(
        private authService: AuthenticationService,
        private notificationService: NotificationService,
        private api: ApiService
    ) {
        effect(() => {
            const currentUser = this.currentUser();
            if (currentUser) {
                this.api.centerAccountApi.getEquipments().pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response => {
                    this.equipment.set(response);
                }))
            }
        });
    }

    onSubmit() {
        const bloodType = this.form.get('bloodType')?.value;
        const bloodAmount = this.form.get('bloodAmount')?.value;
        const noteToDoctor = this.form.get('noteToDoctor')?.value;
        const copperSulfate = this.form.get('copperSulfate')?.value;
        const haemoglobinometer = this.form.get('haemoglobinometer')?.value;
        const lungs = this.form.get('lungs')?.value;
        const heart = this.form.get('heart')?.value;
        const TA = this.form.get('TA')?.value;
        const TT = this.form.get('TT')?.value;
        const TV = this.form.get('TV')?.value;
        const bagType = this.form.get('bagType')?.value;
        const note = this.form.get('note')?.value;
        const punctureSite = this.form.get('punctureSite')?.value;
        const startOfGiving = this.form.get('startOfGiving')?.value;
        const endOfGiving = this.form.get('endOfGiving')?.value;
        const reasonForPrematureTerminationOfBloodDonation = this.form.get('reasonForPrematureTerminationOfBloodDonation')?.value;
        const equipment = this.form.get('equipment')?.value;
        const equipmentAmount = this.form.get('equipmentAmount')?.value;
        const denied = this.form.get('denied')?.value;
        const reasonForDenying = this.form.get('reasonForDenying')?.value;
        this.api.centerAccountApi.createAppointmentReport({
            bloodType: bloodType,
            bloodAmount: bloodAmount,
            noteToDoctor: noteToDoctor,
            copperSulfate: copperSulfate,
            haemoglobinometer: haemoglobinometer,
            lungs: lungs,
            heart: heart,
            ta: TA,
            tt: TT,
            tv: TV,
            bagType: bagType,
            note: note,
            punctureSite: punctureSite,
            startOfGiving: startOfGiving,
            endOfGiving: endOfGiving,
            reasonForPrematureTerminationOfBloodDonation: reasonForPrematureTerminationOfBloodDonation,
            equipmentId: equipment,
            equipmentAmount: equipmentAmount,
            denied: denied,
            reasonForDenying: reasonForDenying
        }).pipe(
            map(response => response.data),
            catchError((error) => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess("Successfully created report.")
            }
        });


    }
}

