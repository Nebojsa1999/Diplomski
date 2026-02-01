import { Api } from "../api";
import { ApiClient } from "../api-client";
import { ApiResponse, RequestConfig } from "../rest.model";
import { Observable } from "rxjs";
import { Appointment, AppointmentDto, AppointmentReport, AppointmentStaus, CreateOperationRoomBookingDto, DenyUserDto, Medication, OperationRoomBooking } from "./hospital.model";

export class AppointmentApi extends Api {
    constructor(client: ApiClient) {
        super(client);
    }

    list(status: AppointmentStaus, from: number | null, to: number | null): Observable<ApiResponse<Appointment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            params: {appointmentStatus: status, from: from as number, to: to as number},
            authenticated: true
        };
        return this.apiClient.get('/api/hospitals/appointments', config);
    }

    listByHospital(id: number, status: AppointmentStaus, from: number | null, to: number | null): Observable<ApiResponse<Appointment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            params: {appointmentStatus: status, from: from as number, to: to as number},
            authenticated: true
        };
        return this.apiClient.get(`/api/hospitals/${id}/appointments`, config);
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

    scheduleAppointment(id: number): Observable<ApiResponse<Appointment>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };

        return this.apiClient.put<undefined, Appointment>(`/api/hospitals/appointments/${id}/schedule`, undefined, config);
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

    createAppointmentReport(appointmentId: number, data: AppointmentReport): Observable<ApiResponse<AppointmentReport>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.post(`/api/hospitals/appointments/${appointmentId}/appointment-report`, data, config);
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

    createMedication(id: number, body: Medication): Observable<ApiResponse<any>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };

        return this.apiClient.post(`/api/hospitals/appointments/${id}/medication`, body, config);
    }

    createRoomBooking(id: number, body: CreateOperationRoomBookingDto): Observable<ApiResponse<any>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };

        return this.apiClient.post(`/api/hospitals/appointments/${id}/operation-room-booking`, body, config);
    }

    listRoomBooking(id: number): Observable<ApiResponse<OperationRoomBooking[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get(`/api/hospitals/appointments/room/${id}/operation-room-booking`, config);
    }

    downloadReport(id: number): Observable<ApiResponse<Blob>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/octet-stream',
            },
            authenticated: true
        };
        return this.apiClient.getFile(`{{host}}/api/hospitals/appointments/${id}/appointment-report/download`, config);
    }

    downloadPrescription(id: number): Observable<ApiResponse<Blob>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/octet-stream',
            },
            authenticated: true
        };
        return this.apiClient.getFile(`{{host}}/api/hospitals/appointments/${id}/medication/download`, config);
    }
}