import { Injectable } from '@angular/core';
import { AuthenticationApi } from "../../rest/authentication/authentication.api";
import { ApiClient } from "../../rest/api-client";
import { UserApi } from "../../rest/user/user.api";
import { HospitalApi } from "../../rest/hospital/hospital.api";
import { AppointmentApi } from "../../rest/hospital/appointment.api";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public readonly authenticationApi = new AuthenticationApi(this.apiClient);
    public readonly userApi = new UserApi(this.apiClient);
    public readonly hospitalApi = new HospitalApi(this.apiClient);
    public readonly appointmentApi = new AppointmentApi(this.apiClient);

    constructor(private apiClient: ApiClient) {
    }


}
