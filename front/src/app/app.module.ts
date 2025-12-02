import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AgmCoreModule } from '@agm/core';
import { AppointmentsComponent } from './appointments/appointments.component';
import { CenterAccountComponent } from './center-account/center-account.component';
import { SearchComponent } from './search/search.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { BloodTypesComponent } from './blood-types/blood-types.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { WorkCalendarComponent } from './work-calendar/work-calendar.component';
import { StartAppointmentComponent } from './start-appointment/start-appointment.component';
import { DenyAppointmentComponent } from './deny-appointment/deny-appointment.component';
import { AppoinmentReportComponent } from './appoinment-report/appoinment-report.component';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SingleAppointmentComponent } from './single-appointment/single-appointment.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    AppointmentsComponent,
    CenterAccountComponent,
    SearchComponent,
    CreateAppointmentComponent,
    BloodTypesComponent,
    ListUsersComponent,
    WorkCalendarComponent,
    StartAppointmentComponent,
    DenyAppointmentComponent,
    AppoinmentReportComponent,
    SingleAppointmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMomentDateModule,
    MatNativeDateModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    HttpClientModule,
    GoogleMapsModule,
    CommonModule,
    NgbModalModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCWGrFk4ZniT9RgJD51xrPzcZ8xeCR3-YU'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
