import { inject, NgModule } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { CenterAccountComponent } from './center-account/center-account.component';
import { SearchComponent } from './search/search.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { BloodTypesComponent } from './blood-types/blood-types.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { DenyAppointmentComponent } from './deny-appointment/deny-appointment.component';
import { StartAppointmentComponent } from './start-appointment/start-appointment.component';
import { AppoinmentReportComponent } from './appoinment-report/appoinment-report.component';
import { WorkCalendarComponent } from './work-calendar/work-calendar.component';
import { SingleAppointmentComponent } from './single-appointment/single-appointment.component';
import { map } from "rxjs/operators";
import { AuthenticationService } from "./authentication.service";

export const unauthenticatedOnlyGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    return inject(AuthenticationService).isAuthenticated().pipe(
        map((authenticated) => {
            return authenticated ? router.createUrlTree(['']) : false;
        })
    )
};

export const authenticatedOnlyGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    return inject(AuthenticationService).isAuthenticated().pipe(
        map((authenticated) => {
            return authenticated ? true : router.createUrlTree(['sign-in']);
        })
    )
};


const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'center',
    component: CenterAccountComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent
  },
  {
    path: 'appointments',
    component: AppointmentsComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'create-appointment',
    component: CreateAppointmentComponent
  },
  {
    path: 'blood',
    component: BloodTypesComponent
  },
  {
    path: 'users',
    component: ListUsersComponent
  },
  {
    path: 'deny-appointment',
    component: DenyAppointmentComponent
  },
  {
    path: 'approve-appointment',
    component: StartAppointmentComponent
  },
  {
    path: 'appointment-report',
    component: AppoinmentReportComponent
  },
  {
    path: 'calendar',
    component: WorkCalendarComponent
  },
  { path: 'single-appointment/:date/:month/:year', component: SingleAppointmentComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
