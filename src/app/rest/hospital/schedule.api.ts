import { Api } from "../api";
import { ApiClient } from "../api-client";
import { ApiResponse, RequestConfig } from "../rest.model";
import { Observable } from "rxjs";
import { DayOfWeek, DoctorSchedule, DoctorScheduleCreateDto, DoctorScheduleUpdateDto } from "./hospital.model";

export class ScheduleApi extends Api {
    constructor(client: ApiClient) {
        super(client);
    }

    list(doctorId?: number, dayOfWeek?: DayOfWeek): Observable<ApiResponse<DoctorSchedule[]>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            params: {doctorId: doctorId as unknown as string, dayOfWeek: dayOfWeek as string},
            authenticated: true
        };
        return this.apiClient.get('/api/users/schedules', config);
    }

    listInRange(startDate: Date, endDate: Date, doctorId?: number): Observable<ApiResponse<DoctorSchedule[]>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            params: {
                startDate: startDate.toISOString() as string,
                endDate: endDate.toISOString() as string,
                ...(doctorId ? {doctorId: doctorId as unknown as string} : {})
            },
            authenticated: true
        };
        return this.apiClient.get('/api/users/schedules/range', config);
    }

    getById(id: number): Observable<ApiResponse<DoctorSchedule>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.get(`/api/users/schedules/${id}`, config);
    }

    create(doctorId: number, data: DoctorScheduleCreateDto): Observable<ApiResponse<DoctorSchedule[]>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json', contentType: 'application/json'},
            authenticated: true
        };
        return this.apiClient.post(`/api/users/${doctorId}/schedules`, data, config);
    }

    update(id: number, data: DoctorScheduleUpdateDto): Observable<ApiResponse<DoctorSchedule>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json', contentType: 'application/json'},
            authenticated: true
        };
        return this.apiClient.put(`/api/users/schedules/${id}`, data, config);
    }

    delete(id: number): Observable<ApiResponse<void>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.delete(`/api/users/schedules/${id}`, config);
    }
}
