import { Component, effect, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../common/service/api.service';
import { shared } from "../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../common/service/authentication.service";
import { Appointment } from "../../rest/center-account/center.account.model";
import { map } from "rxjs/operators";
import { NotificationService } from "../../common/service/notification.service";
import { catchError } from "rxjs";

export const ROUTE_USERS = 'users';

@Component({
    selector: 'app-list-users',
    imports: [shared],
    templateUrl: './list-users.component.html',
    styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent {
    form!: FormGroup;
    displayedColumns: string[] = ['Name', 'Surname', 'DateOfAppointment'];
    currentUser = toSignal(this.authService.activeUser);
    appointments = signal<Appointment[] | null>(null);

    constructor(private authService: AuthenticationService, private api: ApiService, private notificationService: NotificationService) {
        effect(() => {
            const currentUser = this.currentUser();
            if (currentUser) {
                this.api.centerAccountApi.getAppointmentsForCenterAccount(currentUser.centerAccount.id, true).pipe(
                    map(response => response.data),
                    catchError(error => this.notificationService.showError(error.message))
                ).subscribe((response => {
                    this.appointments.set(response);
                }))
            }
        });
    }
}
