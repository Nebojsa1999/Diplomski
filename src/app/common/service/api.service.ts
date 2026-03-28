import { Injectable } from '@angular/core';
import { AuthenticationApi } from "../../rest/authentication/authentication.api";
import { ApiClient } from "../../rest/api-client";
import { UserApi } from "../../rest/user/user.api";
import { HospitalApi } from "../../rest/hospital/hospital.api";
import { AppointmentApi } from "../../rest/hospital/appointment.api";
import { ScheduleApi } from "../../rest/hospital/schedule.api";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public readonly authenticationApi = new AuthenticationApi(this.apiClient);
    public readonly userApi = new UserApi(this.apiClient);
    public readonly hospitalApi = new HospitalApi(this.apiClient);
    public readonly appointmentApi = new AppointmentApi(this.apiClient);
    public readonly scheduleApi = new ScheduleApi(this.apiClient);

    constructor(private apiClient: ApiClient) {
    }


}
