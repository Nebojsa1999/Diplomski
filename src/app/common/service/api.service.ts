import { Injectable } from '@angular/core';
import { AuthenticationApi } from "../../rest/authentication/authentication.api";
import { ApiClient } from "../../rest/api-client";
import { UserApi } from "../../rest/user/user.api";
import { CenterAccountApi } from "../../rest/center-account/center-account.api";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public readonly authenticationApi = new AuthenticationApi(this.apiClient);
    public readonly userApi = new UserApi(this.apiClient);
    public readonly centerAccountApi = new CenterAccountApi(this.apiClient);

    constructor(private apiClient: ApiClient) {
    }


}
