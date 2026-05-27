import { Component, computed, effect, signal } from '@angular/core';
import { ApiService } from '../../../../common/service/api.service';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { catchError } from "rxjs";
import {Role, User} from "../../../../rest/user/user.model";
import { FilterUserComponent, FilterUserParam } from "./filter-user/filter-user.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_CREATE_USER } from "../register/register.component";
import { ROUTE_HOSPITALS } from "../../hospitals/list-hospitals/list-hospitals.component";

export const ROUTE_USERS = 'users';

@Component({
    selector: 'app-list-users',
    imports: [shared, FilterUserComponent],
    templateUrl: './list-users.component.html',
    styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent {
    displayedColumns: string[] = ['Name', 'Surname', 'Role', 'Department', 'Verified', 'MedicalRecord', 'Schedule', 'Update', 'Delete'];
    currentUser = toSignal(this.authService.activeUser);
    users = signal<User[] | null>(null);
    searchFilter = signal<FilterUserParam | null>(null);
    hospitalId: string | null = null;
    isDoctor = this.authService.hasRole(Role.DOCTOR);

    pageIndex = signal(0);
    pageSize = signal(10);

    paginatedUsers = computed(() => {
        const all = this.users() ?? [];
        const start = this.pageIndex() * this.pageSize();
        return all.slice(start, start + this.pageSize());
    });

    constructor(private authService: AuthenticationService,
                private api: ApiService,
                private router: Router,
                private route: ActivatedRoute,
                private notificationService: NotificationService) {
        this.hospitalId = this.route.snapshot.queryParams['hospitalId'] ?? null;
        this.searchFilter.set({ name: '', role: null });

        effect(() => {
            const search = this.searchFilter();
            const request$ = this.hospitalId
                ? this.api.userApi.list(+this.hospitalId, search?.name, search?.role ?? undefined)
                : this.api.userApi.listAll(search?.name);

            request$.pipe(
                map(response => response.data),
                catchError(error => this.notificationService.showError(error.message))
            ).subscribe(response => {
                const filtered = this.hospitalId
                    ? (response ?? []).filter(user => user.role !== Role.ADMIN_SYSTEM)
                    : (response ?? []).filter(user => user.role === Role.PATIENT);
                this.users.set(filtered);
            });
        });
    }

    searchClicked(filter: FilterUserParam) {
        this.pageIndex.set(0);
        this.searchFilter.set(filter);
    }

    onPage(event: import('@angular/material/paginator').PageEvent): void {
        this.pageIndex.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
    }

    goBack() { this.router.navigate([ROUTE_HOSPITALS]); }

    addUser() {
        this.router.navigate([ROUTE_CREATE_USER], { queryParams: { hospitalId: this.hospitalId } });
    }

    deleteUser(id: number) {
        this.api.userApi.deleteUser(id).pipe(
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe(() => {
            this.notificationService.showSuccess('User deleted successfully.');
            this.users.update(items => items?.filter(u => u.id !== id) ?? []);
        });
    }
}
