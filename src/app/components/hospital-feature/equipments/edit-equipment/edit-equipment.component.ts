import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Equipment, Hospital } from "../../../../rest/hospital/hospital.model";
import { map } from "rxjs/operators";
import { catchError, of } from "rxjs";
import { ApiService } from "../../../../common/service/api.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { shared } from "../../../../app.config";
import { ROUTE_EQUIPMENTS } from "../list-equipments/list-equipments.component";

export const ROUTE_EDIT_EQUIPMENT = 'edit-equipment';

@Component({
    selector: 'app-edit-equipment',
    imports: [
        shared
    ],
    templateUrl: './edit-equipment.component.html',
    styleUrl: './edit-equipment.component.scss',
})
export class EditEquipmentComponent {
    form = new FormGroup({
        name: new FormControl<string | null>('', [Validators.required]),
        amount: new FormControl<number | null>(null, [Validators.required]),
        hospital: new FormControl<Hospital | null>(null, [Validators.required])
    });
    hospital$ = this.apiService.hospitalApi.list().pipe(
        map(response => response.data),
        catchError(error => of([]))
    )

    compareHospitalById = (a: Hospital | null, b: Hospital | null): boolean => {
        if (!a || !b) {
            return a === b;
        }
        return a.id === b.id;
    };

    constructor(private apiService: ApiService, private route: ActivatedRoute, private notificationService: NotificationService, private router: Router) {
        this.form.get('hospital')?.disable()
        const id = this.route.snapshot.params['id']
        this.apiService.hospitalApi.getEquipment(id).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((equipment) => {

            this.form.patchValue({
                name: equipment?.name,
                amount: equipment?.amount,
                hospital: equipment?.hospital
            })
        })
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

        this.apiService.hospitalApi.editEquipment(this.route.snapshot.params['id'], equipment).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully edited equipment.');
                this.router.navigate([ROUTE_EQUIPMENTS]);
            }
        });
    }
}
