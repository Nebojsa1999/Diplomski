import { Component, effect, signal } from '@angular/core';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { Hospital } from "../../../../rest/hospital/hospital.model";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { ApiService } from "../../../../common/service/api.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError } from "rxjs";
import { FilterHospitalComponent } from "./filter-hospital/filter-hospital/filter-hospital.component";
import { Router } from "@angular/router";
import { ROUTE_CREATE_HOSPITAL } from "../create-hospital/create-hospital.component";

export const ROUTE_HOSPITALS = 'hospitals';

@Component({
    selector: 'app-list-hospitals',
    imports: [shared, FilterHospitalComponent],
    templateUrl: './list-hospitals.component.html',
    styleUrl: './list-hospitals.component.scss',
})
export class ListHospitalsComponent {
    displayedColumns: string[] = ['Name', 'Address', 'WorkTime', 'Rating', 'Update'];
    currentUser = toSignal(this.authService.activeUser);
    hospitals = signal<Hospital[] | null>(null);
    searchParameter = signal<string | null>(null);

    constructor(private authService: AuthenticationService, private api: ApiService, private notificationService: NotificationService, private router: Router) {
        effect(() => {
            const currentUser = this.currentUser();
            const searchParameter = this.searchParameter()
            if (currentUser) {
                this.api.hospitalApi.list(searchParameter ?? '').pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response => {
                    this.hospitals.set(response);
                }))
            }
        });
    }

    searchClicked(searchParams: string) {
        this.searchParameter.set(searchParams)
    }

    addHospital() {
        this.router.navigate([ROUTE_CREATE_HOSPITAL]);
    }

    removeSeconds(time: string) {
        return time.split(":")[0] + ":" + time.split(":")[1]
    }
}
