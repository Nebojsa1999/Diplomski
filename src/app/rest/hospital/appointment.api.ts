import { Api } from "../api";
import { ApiClient } from "../api-client";
import { ApiResponse, RequestConfig } from "../rest.model";
import { Observable } from "rxjs";
import { Appointment, AppointmentDto, AppointmentReport, AppointmentReportDto, AppointmentStaus, DenyUserDto, PrescriptionDto } from "./hospital.model";

export class AppointmentApi extends Api {
    constructor(client: ApiClient) {
        super(client);
    }

    addAppointment(data: any) {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.post('/api/appointments/add', data, config);
    }

    getAppointments(id: number): Observable<ApiResponse<Appointment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get('/api/hospitals/appointments/' + id, config);
    }

    createAppointment(data: AppointmentDto): Observable<ApiResponse<Appointment>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.post("/api/hospitals/create-appointment", data, config);
    }

    deny(denyUserDto: DenyUserDto): Observable<ApiResponse<void>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.put<DenyUserDto, void>("/api/hospitals/deny-user", denyUserDto, config);
    }

    createAppointmentReport(data: AppointmentReportDto): Observable<ApiResponse<AppointmentReport>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.post("/api/hospitals/appointment-report", data, config);
    }

    getAppointmentsDate(data: AppointmentDto): Observable<ApiResponse<Appointment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.post("/api/hospitals/appointments-date", data, config);
    }

    getScheduledAppointmentsThatAreNotFinished(id: number, appointmentStatus?: AppointmentStaus): Observable<ApiResponse<Appointment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            params: {appointmentStatus: appointmentStatus as AppointmentStaus},
            authenticated: true
        };
        return this.apiClient.get("/api/hospitals/scheduled-appointments/" + id, config)
    }

    getAppointment(id: number): Observable<ApiResponse<Appointment>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get("/api/hospitals/appointment/" + id, config);
    }

    getAppointmentsForHospital(id: number, completed?: boolean): Observable<ApiResponse<Appointment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            params: {completed: completed as boolean},
            authenticated: true
        };
        return this.apiClient.get(`/api/hospitals/scheduled-appointments/${id}`, config);
    }

    createPrescription(body: PrescriptionDto): Observable<ApiResponse<any>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };

        return this.apiClient.post(`/api/hospitals/prescription`, body, config);
    }
}