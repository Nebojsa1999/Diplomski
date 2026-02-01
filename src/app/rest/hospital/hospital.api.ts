import { Api } from "../api";
import { ApiClient } from "../api-client";
import { ApiResponse, RequestConfig } from "../rest.model";
import { Equipment, Hospital, HospitalDto, Room, RoomType } from "./hospital.model";
import { Observable } from "rxjs";
import { Role, User } from "../user/user.model";

export class HospitalApi extends Api {
    constructor(client: ApiClient) {
        super(client);
    }

    getHospital(id: number): Observable<ApiResponse<Hospital>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get<Hospital>(`/api/hospitals/${id}`, config);
    }

    createHospital(data: HospitalDto): Observable<ApiResponse<Hospital>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.post(`/api/hospitals`, data, config);
    }

    updateHospital(id: number, data: HospitalDto): Observable<ApiResponse<Hospital>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.put(`/api/hospitals/${id}`, data, config);
    }

    list(name?: string): Observable<ApiResponse<Hospital[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            params: {name: name as string},
            authenticated: true
        };
        return this.apiClient.get("/api/hospitals", config);
    }

    getUsersFromHospital(id: number, role?: Role | null, name?: string): Observable<ApiResponse<User[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            params: {role: role as Role, name: name as string},
            authenticated: true
        };
        return this.apiClient.get<User[]>("/api/hospitals/" + id + "/users", config);
    }

    createEquipment(equipment: Equipment): Observable<ApiResponse<Equipment>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };

        return this.apiClient.post(`/api/hospitals/equipment`, equipment, config)
    }

    editEquipment(id: number, data: Equipment): Observable<ApiResponse<Equipment>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.put(`/api/hospitals/equipment/${id}`, data, config);
    }

    getEquipment(id: number): Observable<ApiResponse<Equipment>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get(`/api/hospitals/equipment/${id}`, config);
    }

    getEquipments(name?: string): Observable<ApiResponse<Equipment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            params: {name: name as string},
            authenticated: true
        };
        return this.apiClient.get("/api/hospitals/equipments", config);
    }

    getEquipmentsByHospital(id: number, name?: string): Observable<ApiResponse<Equipment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            params: {name: name as string},
            authenticated: true,
        };

        return this.apiClient.get(`/api/hospitals/${id}/equipments`, config);
    }

    getRoom(id: number): Observable<ApiResponse<Room>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get(`/api/hospitals/room/${id}`, config);
    }

    createRoom(room: Room): Observable<ApiResponse<Room>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };

        return this.apiClient.post(`/api/hospitals/room`, room, config)
    }

    editRoom(id: number, data: Room): Observable<ApiResponse<Room>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };

        return this.apiClient.put(`/api/hospitals/room/${id}`, data, config);
    }

    listRooms(name?: string): Observable<ApiResponse<Room[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            params: {name: name as string},
            authenticated: true,
        };

        return this.apiClient.get(`/api/hospitals/rooms`, config);
    }

    availableRooms(id: number, name?: string, roomType?: RoomType): Observable<ApiResponse<Room[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            params: {name: name as string,roomType: roomType as RoomType},
            authenticated: true,
        };

        return this.apiClient.get(`/api/hospitals/${id}/free-rooms`, config);
    }
}