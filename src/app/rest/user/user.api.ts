import { Api } from "../api";
import { ApiClient } from "../api-client";
import { Observable } from "rxjs";
import { ApiResponse, RequestConfig } from "../rest.model";
import { ChangePasswordDto, FavoriteDoctor, UpdateUserDto, User, UserDto } from "./user.model";

export class UserApi extends Api {
    constructor(client: ApiClient) {
        super(client);
    }

    register(data: UserDto): Observable<ApiResponse<User>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            }
        };
        return this.apiClient.post("/api/register", data, config);
    }

    addUser(data: UserDto): Observable<ApiResponse<User>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.post("/api/register", data, config);
    }

    updateUser(id: number, data: UpdateUserDto): Observable<ApiResponse<User>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.put(`/api/users/${id}`, data, config);
    }

    updateProfile(data: UpdateUserDto): Observable<ApiResponse<User>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.put("/api/users/update-profile", data, config);
    }

    changePassword(data: ChangePasswordDto): Observable<ApiResponse<User>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.put("/api/users/change-password", data, config);
    }

    getUser(id: number): Observable<ApiResponse<User>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get("/api/users/" + id, config);
    }

    deleteUser(id: number): Observable<ApiResponse<void>> {
        const config: RequestConfig = {
            headers: { accept: 'application/json' },
            authenticated: true
        };
        return this.apiClient.delete(`/api/users/${id}`, config);
    }

    getFavorites(): Observable<ApiResponse<FavoriteDoctor[]>> {
        const config: RequestConfig = {
            headers: { accept: 'application/json' },
            authenticated: true
        };
        return this.apiClient.get('/api/doctors/favorites', config);
    }

    addFavorite(doctorId: number): Observable<ApiResponse<FavoriteDoctor>> {
        const config: RequestConfig = {
            headers: { accept: 'application/json' },
            authenticated: true
        };
        return this.apiClient.post(`/api/doctors/${doctorId}/favorite`, {}, config);
    }

    removeFavorite(doctorId: number): Observable<ApiResponse<void>> {
        const config: RequestConfig = {
            headers: { accept: 'application/json' },
            authenticated: true
        };
        return this.apiClient.delete(`/api/doctors/${doctorId}/favorite`, config);
    }

    list(id: number, name?: string, role?: string): Observable<ApiResponse<User[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            params: { name: name as string, role: role as string },
            authenticated: true
        };
        return this.apiClient.get<User[]>("/api/users/hospitals/" + id, config);
    }
}