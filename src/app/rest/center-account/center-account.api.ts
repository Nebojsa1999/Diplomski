import { Api } from "../api";
import { ApiClient } from "../api-client";
import { ApiResponse, RequestConfig } from "../rest.model";
import { Appointment, AppointmentDto, AppointmentReport, AppointmentReportDto, BloodSampleDto, CenterAccount, CenterAccountDto, DenyUserDto, Equipment, SearchDto } from "./center.account.model";
import { Observable } from "rxjs";
import { User } from "../user/user.model";

export class CenterAccountApi extends Api {
    constructor(client: ApiClient) {
        super(client);
    }

    getCenterAccount(): Observable<ApiResponse<CenterAccount>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get<CenterAccount>('/api/center', config);
    }

    updateCenterAccount(data: CenterAccountDto): Observable<ApiResponse<CenterAccount>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.put("/api/center", data, config);
    }

    searchCenter(data: SearchDto): Observable<ApiResponse<CenterAccount[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.post("/api/center/search", data, config);
    }

    getAdminsOfCenter(id: number): Observable<ApiResponse<User[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get<User[]>("/api/center/admins-of-center/" + id, config);
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
        return this.apiClient.get('/api/center/appointments/' + id, config);
    }

    createAppointment(data: AppointmentDto): Observable<ApiResponse<Appointment>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.post("/api/center/create-appointment", data, config);
    }

    deny(denyUserDto: DenyUserDto): Observable<ApiResponse<void>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.put<DenyUserDto, void>("/api/center/deny-user", denyUserDto, config);
    }

    getEquipments(): Observable<ApiResponse<Equipment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get("/api/center/equipments", config);
    }

    createAppointmentReport(data: AppointmentReportDto): Observable<ApiResponse<AppointmentReport>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.post("/api/center/appointment-report", data, config);
    }

    getAppointmentsDate(data: AppointmentDto): Observable<ApiResponse<Appointment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.post("/api/center/appointments-date", data, config);
    }

    getBloodByCenterAccount(id: number): Observable<ApiResponse<BloodSampleDto[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get(`/api/center/${id}/bloodSample`, config);
    }

    getScheduledAppointmentsThatAreNotFinished(id: number): Observable<ApiResponse<Appointment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get("/api/center/scheduled-appointments/" + id, config)
    }

    getAppointment(id: number): Observable<ApiResponse<Appointment>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get("/api/center/appointment/" + id, config);
    }

    getAppointmentsForCenterAccount(id: number, completed?: boolean): Observable<ApiResponse<Appointment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            params: {completed: completed as boolean},
            authenticated: true
        };
        return this.apiClient.get(`/api/center/scheduled-appointments/${id}`, config);
    }
}