import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { LoginComponent, ROUTE_SIGN_IN } from "./components/login/login.component";
import { RegisterComponent, ROUTE_REGISTER } from "./components/register/register.component";
import { ChangePasswordComponent, ROUTE_CHANGE_PASSWORD } from "./components/change-password/change-password.component";
import { EditProfileComponent, ROUTE_EDIT_PROFILE } from "./components/edit-profile/edit-profile.component";
import { AppointmentsComponent, ROUTE_APPOINTMENTS } from "./components/appointments/appointments.component";
import { CenterAccountComponent, ROUTE_HOSPITAL } from './components/center-account/center-account.component';
import { ROUTE_SEARCH, SearchComponent } from './components/search/search.component';
import { CreateAppointmentComponent, ROUTE_CREATE_APPOINTMENT } from './components/create-appointment/create-appointment.component';
import { BloodTypesComponent, ROUTE_BLOOD_SAMPLES } from './components/blood-types/blood-types.component';
import { ListUsersComponent, ROUTE_USERS } from './components/list-users/list-users.component';
import { DenyAppointmentComponent, ROUTE_DENY_APPOINTMENT } from './components/deny-appointment/deny-appointment.component';
import { ROUTE_START_APPOINTMENT, StartAppointmentComponent } from './components/start-appointment/start-appointment.component';
import { AppointmentReportComponent, ROUTE_APPOINTMENT_REPORT } from './components/appoinment-report/appointment-report.component';
import { ROUTE_WORK_CALENDAR, WorkCalendarComponent } from './components/work-calendar/work-calendar.component';
import { ROUTE_SINGLE_APPOINTMENT, SingleAppointmentComponent } from './components/single-appointment/single-appointment.component';
import { map } from "rxjs/operators";
import { AuthenticationService } from "./common/service/authentication.service";
import { MainComponentComponent } from "./components/main-component.component";

export const unauthenticatedOnlyGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    return inject(AuthenticationService).isAuthenticated().pipe(
        map((authenticated) => {
            return authenticated ? router.createUrlTree(['']) : true;
        })
    )
};

export const authenticatedOnlyGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    return inject(AuthenticationService).isAuthenticated().pipe(
        map((authenticated) => {
            return authenticated ? true : router.createUrlTree([ROUTE_SIGN_IN]);
        })
    )
};


export const routes: Routes = [
    {
        path: ROUTE_SIGN_IN,
        component: LoginComponent,
        canActivate: [unauthenticatedOnlyGuard]
    },
    {
        path: '',
        component: MainComponentComponent,
        children: [
            {
                path: ROUTE_HOSPITAL,
                component: CenterAccountComponent,
            },
            {
                path: ROUTE_REGISTER,
                component: RegisterComponent
            },
            {
                path: ROUTE_CHANGE_PASSWORD,
                component: ChangePasswordComponent
            },
            {
                path: ROUTE_EDIT_PROFILE,
                component: EditProfileComponent,
            },
            {
                path: ROUTE_APPOINTMENTS,
                component: AppointmentsComponent,
            },
            {
                path: ROUTE_SEARCH,
                component: SearchComponent
            },
            {
                path: ROUTE_CREATE_APPOINTMENT,
                component: CreateAppointmentComponent,
            },
            {
                path: ROUTE_BLOOD_SAMPLES,
                component: BloodTypesComponent,
            },
            {
                path: ROUTE_USERS,
                component: ListUsersComponent,
            },
            {
                path: ROUTE_DENY_APPOINTMENT,
                component: DenyAppointmentComponent,
            },
            {
                path: ROUTE_START_APPOINTMENT,
                component: StartAppointmentComponent,
            },
            {
                path: ROUTE_APPOINTMENT_REPORT,
                component: AppointmentReportComponent,
            },
            {
                path: ROUTE_WORK_CALENDAR,
                component: WorkCalendarComponent,

            },
            {
                path: `${ROUTE_SINGLE_APPOINTMENT}/:date/:month/:year`,
                component: SingleAppointmentComponent
            },
            {
                path: '**',
                redirectTo: ROUTE_HOSPITAL
            }
        ],
        canActivate: [authenticatedOnlyGuard],
    },
    {
        path: '**',
        redirectTo: '',
    }
];
