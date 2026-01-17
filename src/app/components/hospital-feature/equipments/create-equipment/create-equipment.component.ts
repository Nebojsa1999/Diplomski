import { Component } from '@angular/core';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Equipment, Hospital } from "../../../../rest/hospital/hospital.model";
import { ApiService } from "../../../../common/service/api.service";
import { catchError, of } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { Router } from "@angular/router";
import { ROUTE_EQUIPMENTS } from "../list-equipments/list-equipments.component";

export const ROUTE_CREATE_EQUIPMENT = 'create-equipment';

@Component({
    selector: 'app-create-equipment',
    imports: [shared],
    templateUrl: './create-equipment.component.html',
    styleUrl: './create-equipment.component.scss',
})
export class CreateEquipmentComponent {
    form = new FormGroup({
        name: new FormControl<string | null>('', [Validators.required]),
        amount: new FormControl<number | null>(null, [Validators.required]),
        hospital: new FormControl<Hospital | null>(null, [Validators.required])
    });
    hospital$ = this.apiService.hospitalApi.list().pipe(
        map(response => response.data),
        catchError(error => of([]))
    )

    constructor(private apiService: ApiService, private notificationService: NotificationService, private router: Router) {
    }

    onSubmit() {
        const name = this.form.get('name')?.value;
        const amount = this.form.get('amount')?.value;
        const hospital = this.form.get('hospital')?.value;

        const equipment: Equipment = {
            name: name as string,
            amount: amount as number,
            hospital: hospital as Hospital
        }

        this.apiService.hospitalApi.createEquipment(equipment).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully created equipment.');
                this.router.navigate([ROUTE_EQUIPMENTS]);
            }
        });
    }
}
