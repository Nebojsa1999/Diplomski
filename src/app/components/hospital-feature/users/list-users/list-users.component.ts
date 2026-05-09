import { Component, effect, signal } from '@angular/core';
import { ApiService } from '../../../../common/service/api.service';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { catchError } from "rxjs";
import { User } from "../../../../rest/user/user.model";
import { FilterUserComponent, FilterUserParam } from "./filter-user/filter-user.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ROUTE_ADD_USER } from "../register/register.component";
import { ROUTE_HOSPITALS } from "../../hospitals/list-hospitals/list-hospitals.component";

export const ROUTE_USERS = 'users';

@Component({
    selector: 'app-list-users',
    imports: [shared, FilterUserComponent],
    templateUrl: './list-users.component.html',
    styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent {
    displayedColumns: string[] = ['Name', 'Surname', 'Role', 'MedicalRecord', 'Schedule', 'Update', 'Delete'];
    currentUser = toSignal(this.authService.activeUser);
    users = signal<User[] | null>(null);
    searchFilter = signal<FilterUserParam | null>(null)

    constructor(private authService: AuthenticationService,
                private api: ApiService,
                private router: Router,
                private route: ActivatedRoute,
                private notificationService: NotificationService,
                private location: Location) {
        const hospitalId = this.route.snapshot.queryParams['hospitalId'];
        if (hospitalId) {
            this.searchFilter.set({ name: '', hospital: +hospitalId });
        }

        effect(() => {
            const search = this.searchFilter();

            if (search?.hospital) {
                this.api.hospitalApi.getUsersFromHospital(search.hospital as number, null, search.name ?? '').pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response => {
                    this.users.set(response);
                }))
            } else {
                this.api.userApi.list(search?.name).pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response => {
                    this.users.set(response);
                }))
            }
        });
    }

    searchClicked(filter: FilterUserParam) {
        this.searchFilter.set(filter);
    }

    goBack() { this.router.navigate([ROUTE_HOSPITALS]); }

    addUser() {
        this.router.navigate([ROUTE_ADD_USER])
    }

    deleteUser(id: number) {
        this.api.userApi.deleteUser(id).pipe(
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe(() => {
            this.users.update(items => items?.filter(u => u.id !== id) ?? []);
        });
    }
}
