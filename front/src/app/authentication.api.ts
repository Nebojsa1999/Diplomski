import { Observable } from "rxjs";
import { ApiClient } from "./api-client";
import { ApiResponse, RequestConfig } from "./rest.model";
import { Api } from "./api";
import { LoginDto, SignInResponse } from "./authentication.model";

export class AuthenticationApi extends Api {

    constructor(client: ApiClient) {
        super(client);
    }

    /**
     * Signs in user by email.
     */
    emailSignIn(body: LoginDto): Observable<ApiResponse<SignInResponse>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
        };

        return this.apiClient.post<LoginDto, SignInResponse>(`/api/login`, body, config);
    }

    refreshToken(body: string): Observable<ApiResponse<SignInResponse>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
        };

        return this.apiClient.put<string, SignInResponse>(`/api/refreshToken`, body, config);
    }
}
