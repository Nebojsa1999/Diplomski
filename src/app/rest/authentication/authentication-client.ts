import { defer, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ApiResponse } from "../rest.model";
import { SignInResponse } from "./authentication.model";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationClient {
    private readonly baseUrl;

    constructor() {
        this.baseUrl = "http://localhost:8081";
    }

    refreshToken(token: string): Observable<ApiResponse<SignInResponse>> {
        return defer(async () => {
            const response = await fetch(`${this.baseUrl}/api/refreshToken`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: token,
            });

            return {
                data: await response.json(),
                headers: {}
            }
        });
    }
}
