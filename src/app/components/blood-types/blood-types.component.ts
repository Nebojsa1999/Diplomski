import { Component, effect, signal } from '@angular/core';
import { ApiService } from '../../common/service/api.service';
import { shared } from "../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../common/service/authentication.service";
import { map } from "rxjs/operators";
import { BloodSampleDto } from "../../rest/center-account/center.account.model";
import { NotificationService } from "../../common/service/notification.service";
import { catchError } from "rxjs";

export const ROUTE_BLOOD_SAMPLES = 'blood-samples';

@Component({
    selector: 'app-blood-types',
    imports: [shared],
    templateUrl: './blood-types.component.html',
    styleUrls: ['./blood-types.component.scss']
})
export class BloodTypesComponent {
    currentUser = toSignal(this.authService.activeUser);
    blood = signal<BloodSampleDto[] | null>(null);

    constructor(private api: ApiService, private authService: AuthenticationService, private notificationService: NotificationService) {
        effect(() => {
            const currentUser = this.currentUser();

            if (currentUser) {
                this.api.centerAccountApi.getBloodByCenterAccount(currentUser.centerAccount.id).pipe(
                    map((response) => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response) => {
                    this.blood.set(response);
                })
            }
        });
    }

    getCombinedBloodSamples(bloodSampleDto: BloodSampleDto[]) {
        const combined = bloodSampleDto.reduce((acc, curr) => {
            if (!acc[curr.bloodType]) {
                acc[curr.bloodType] = {bloodType: curr.bloodType, amount: 0};
            }
            acc[curr.bloodType].amount += curr.amount;
            return acc;
        }, {} as Record<string, { bloodType: string; amount: number }>);

        return Object.values(combined);
    }
}
