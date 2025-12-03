import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationApi } from "./authentication.api";
import { ApiClient } from "./api-client";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public readonly authenticationApi = new AuthenticationApi(this.apiClient);


    constructor(private http: HttpClient, private apiClient: ApiClient) {
    }

    getAuthHeader(): any {

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }

        return {
            headers: headers
        };
    }

    // register(data: any) {
    //     return this.http.post(this.baseURL + "/api/users/register", data);
    // }
    //
    // updateProfile(data: any) {
    //     return this.http.put(this.baseURL + "/api/users/update-profile", data, this.getAuthHeader());
    // }
    //
    // login(data: any): any {
    //     return this.http.post(this.baseURL + "/api/users/login", data);
    // }
    //
    // getCurrentUser(): any {
    //     return this.http.get(this.baseURL + "/api/users/current", this.getAuthHeader());
    // }
    //
    // changePassword(data: any): any {
    //     return this.http.put(this.baseURL + "/api/users/change-password", data, this.getAuthHeader());
    // }
    //
    //
    // addAppointment(data: any) {
    //     return this.http.post(this.baseURL + '/api/appointments/add', data, this.getAuthHeader());
    // }
    //
    //
    // getAppointments(id: any) {
    //     return this.http.get(this.baseURL + '/api/center/appointments/' + id, this.getAuthHeader());
    // }
    //
    //
    // getCenterAccount() {
    //     return this.http.get(this.baseURL + '/api/center', this.getAuthHeader());
    // }
    //
    // updateCenterAccount(data: any) {
    //     return this.http.put(this.baseURL + "/api/center", data, this.getAuthHeader());
    // }
    //
    // searchCenter(data: any) {
    //     return this.http.post(this.baseURL + "/api/center/search", data);
    // }
    //
    // createAppointment(data: any) {
    //     return this.http.post(this.baseURL + "/api/center/create-appointment", data, this.getAuthHeader());
    // }
    //
    // getAdminsOfCenter(id: any) {
    //     return this.http.get(this.baseURL + "/api/center/admins-of-center/" + id, this.getAuthHeader());
    // }
    //
    // getBloodAType(id: any) {
    //     return this.http.get(this.baseURL + "/api/center/blood-A/" + id, this.getAuthHeader());
    // }
    //
    // getBloodBType(id: any) {
    //     return this.http.get(this.baseURL + "/api/center/blood-B/" + id, this.getAuthHeader());
    // }
    //
    // getBloodABType(id: any) {
    //     return this.http.get(this.baseURL + "/api/center/blood-AB/" + id, this.getAuthHeader());
    // }
    //
    // getBlood0Type(id: any) {
    //     return this.http.get(this.baseURL + "/api/center/blood-0/" + id, this.getAuthHeader());
    // }
    //
    // getUsersFromScheduledAppointmets(data: any) {
    //     return this.http.post(this.baseURL + "/api/center/scheduled-appointments", data, this.getAuthHeader());
    // }
    //
    // getScheduledAppointmentsThatAreNotFinished(id: any) {
    //     return this.http.get(this.baseURL + "/api/center/scheduled-appointments/" + id, this.getAuthHeader())
    // }
    //
    // getUser(id: any) {
    //     return this.http.get(this.baseURL + "/api/users/" + id, this.getAuthHeader());
    // }
    //
    // getAppointment(id: any) {
    //     return this.http.get(this.baseURL + "/api/center/appointment/" + id, this.getAuthHeader());
    // }
    //
    // deny(id: any) {
    //     return this.http.put(this.baseURL + "/api/center/deny-user", id, this.getAuthHeader());
    // }
    //
    // getEquipments() {
    //     return this.http.get(this.baseURL + "/api/center/equipments", this.getAuthHeader());
    // }
    //
    // createAppointmentReport(data: any) {
    //     return this.http.post(this.baseURL + "/api/center/appointment-report", data, this.getAuthHeader());
    // }
    //
    // getAppointmentsDate(data: any) {
    //     return this.http.post(this.baseURL + "/api/center/appointments-date", data, this.getAuthHeader());
    // }
}
