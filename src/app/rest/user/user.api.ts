import { Api } from "../api";
import { ApiClient } from "../api-client";
import { Observable } from "rxjs";
import { ApiResponse, RequestConfig } from "../rest.model";
import { ChangePasswordDto, UpdateUserDto, User, UserDto } from "./user.model";

export class UserApi extends Api {
    constructor(client: ApiClient) {
        super(client);
    }

    register(data: UserDto): Observable<ApiResponse<User>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.post("/api/users/register", data, config);
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

    list(name?: string): Observable<ApiResponse<User[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            params: {name: name as string},
            authenticated: true
        };
        return this.apiClient.get("/api/users", config)
    }
}