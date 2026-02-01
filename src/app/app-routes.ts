import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { LoginComponent, ROUTE_SIGN_IN } from "./components/profile-feature/login/login.component";
import { RegisterComponent, ROUTE_REGISTER } from "./components/hospital-feature/users/register/register.component";
import { ChangePasswordComponent, ROUTE_CHANGE_PASSWORD } from "./components/profile-feature/change-password/change-password.component";
import { EditUserProfileComponent, ROUTE_EDIT_PROFILE } from "./components/hospital-feature/users/edit-user-profile/edit-user-profile.component";
import { HospitalComponent, ROUTE_HOSPITAL } from './components/hospital-feature/hospitals/upsert-hospital/hospital.component';
import { CreateAppointmentComponent, ROUTE_CREATE_APPOINTMENT } from './components/appointment-feature/appointments/create-appointment/create-appointment.component';
import { ListUsersComponent, ROUTE_USERS } from './components/hospital-feature/users/list-users/list-users.component';
import { DenyAppointmentComponent, ROUTE_DENY_APPOINTMENT } from './components/appointment-feature/appointments/deny-appointment/deny-appointment.component';
import { AppointmentReportComponent, ROUTE_APPOINTMENT_REPORT } from './components/appointment-feature/reports/appoinment-report/appointment-report.component';
import { ROUTE_WORK_CALENDAR, WorkCalendarComponent } from './components/work-calendar/work-calendar.component';
import { ROUTE_SINGLE_APPOINTMENT, SingleAppointmentComponent } from './components/single-appointment/single-appointment.component';
import { map } from "rxjs/operators";
import { AuthenticationService } from "./common/service/authentication.service";
import { MainComponentComponent } from "./components/main-component.component";
import { CreateRoomComponent, ROUTE_CREATE_ROOM } from "./components/hospital-feature/rooms/create-room/create-room.component";
import { CreateMedicationComponent, ROUTE_CREATE_MEDICATION } from "./components/appointment-feature/reports/create-medication/create-medication.component";
import { ListHospitalsComponent, ROUTE_HOSPITALS } from "./components/hospital-feature/hospitals/list-hospitals/list-hospitals.component";
import { ListRoomsComponent, ROUTE_ROOMS } from "./components/hospital-feature/rooms/list-rooms/list-rooms.component";
import { ListEquipmentsComponent, ROUTE_EQUIPMENTS } from "./components/hospital-feature/equipments/list-equipments/list-equipments.component";
import { CreateEquipmentComponent, ROUTE_CREATE_EQUIPMENT } from "./components/hospital-feature/equipments/create-equipment/create-equipment.component";
import { EditEquipmentComponent, ROUTE_EDIT_EQUIPMENT } from "./components/hospital-feature/equipments/edit-equipment/edit-equipment.component";
import { EditRoomComponent, ROUTE_EDIT_ROOM } from "./components/hospital-feature/rooms/edit-room/edit-room.component";
import { CreateHospitalComponent, ROUTE_CREATE_HOSPITAL } from "./components/hospital-feature/hospitals/create-hospital/create-hospital.component";
import { ListAppointmentsComponent, ROUTE_APPOINTMENTS } from "./components/appointment-feature/appointments/list-appointments/list-appointments.component";
import { CreateRoomBookingComponent, ROUTE_CREATE_ROOM_BOOKING } from "./components/appointment-feature/room-bookings/create-room-booking/create-room-booking.component";
import { ListRoomBookingsComponent, ROUTE_ROOM_BOOKINGS } from "./components/appointment-feature/room-bookings/list-room-bookings/list-room-bookings.component";

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
                path: `${ROUTE_HOSPITAL}/:id`,
                component: HospitalComponent,
            },
            {
                path: ROUTE_HOSPITALS,
                component: ListHospitalsComponent
            },
            {
                path: ROUTE_CREATE_HOSPITAL,
                component: CreateHospitalComponent
            },
            {
                path: ROUTE_REGISTER,
                component: RegisterComponent
            },
            {
                path: `${ROUTE_EDIT_PROFILE}/:id`,
                component: EditUserProfileComponent,
            },
            {
                path: ROUTE_USERS,
                component: ListUsersComponent,
            },
            {
                path: ROUTE_CREATE_ROOM,
                component: CreateRoomComponent,
            },
            {
                path: `${ROUTE_EDIT_ROOM}/:id`,
                component: EditRoomComponent
            },
            {
                path: ROUTE_ROOMS,
                component: ListRoomsComponent
            },
            {
                path: ROUTE_EQUIPMENTS,
                component: ListEquipmentsComponent
            },
            {
                path: ROUTE_CREATE_EQUIPMENT,
                component: CreateEquipmentComponent
            },
            {
                path: `${ROUTE_EDIT_EQUIPMENT}/:id`,
                component: EditEquipmentComponent
            },
            {
                path: ROUTE_CHANGE_PASSWORD,
                component: ChangePasswordComponent
            },
            {
                path: ROUTE_APPOINTMENTS,
                component: ListAppointmentsComponent,
            },
            {
                path: ROUTE_CREATE_APPOINTMENT,
                component: CreateAppointmentComponent,
            },
            {
                path: `${ROUTE_DENY_APPOINTMENT}/:id`,
                component: DenyAppointmentComponent,
            },
            {
                path: `:id/${ROUTE_APPOINTMENT_REPORT}`,
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
                path: `:id/${ROUTE_CREATE_MEDICATION}`,
                component: CreateMedicationComponent
            },
            {
                path: `:id/${ROUTE_CREATE_ROOM_BOOKING}`,
                component: CreateRoomBookingComponent
            },
            {
                path: `:id/${ROUTE_ROOM_BOOKINGS}`,
                component: ListRoomBookingsComponent
            },
            {
                path: '**',
                redirectTo: ROUTE_APPOINTMENTS
            }
        ],
        canActivate: [authenticatedOnlyGuard],
    },
    {
        path: '**',
        redirectTo: '',
    }
];
