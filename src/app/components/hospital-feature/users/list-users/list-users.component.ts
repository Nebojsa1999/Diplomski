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
import { Router } from "@angular/router";
import { ROUTE_REGISTER } from "../register/register.component";

export const ROUTE_USERS = 'users';

@Component({
    selector: 'app-list-users',
    imports: [shared, FilterUserComponent],
    templateUrl: './list-users.component.html',
    styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent {
    displayedColumns: string[] = ['Name', 'Surname', 'Role', 'Update'];
    currentUser = toSignal(this.authService.activeUser);
    users = signal<User[] | null>(null);
    searchFilter = signal<FilterUserParam | null>(null)

    constructor(private authService: AuthenticationService,
                private api: ApiService,
                private router: Router,
                private notificationService: NotificationService) {
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

    addUser() {
        this.router.navigate([ROUTE_REGISTER])
    }
}
