import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { ApiService } from "./api.service";
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { User } from "./authentication.model";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private readonly LSK_REFRESH_TOKEN = "WA_REFRESH_TOKEN";

    private refreshToken: string | null = null;

    private activeUser$ = new BehaviorSubject<User | null>(null);
    private authenticationTokens: Record<number, string> = {};

    constructor(private apiService: ApiService) {
        this.refreshToken = localStorage.getItem(this.LSK_REFRESH_TOKEN) ?? null;
    }

    public authenticate(email: string, password: string) {
        this.apiService.authenticationApi.emailSignIn({
            username: email,
            password: password
        }).pipe(
            map((response) => response.data),
        ).subscribe((response) => {
            if (!response) {
                return;
            }

            this.refreshToken = response.refreshToken;
            localStorage.setItem(this.LSK_REFRESH_TOKEN, this.refreshToken);

            this.activeUser$.next(new User(response.user));

            this.authenticationTokens = {};
            response.accessList.forEach((access) => this.authenticationTokens[access.contextId] = access.accessToken)
        })
    }

    public logout() {
        this.refreshToken = null;
        localStorage.removeItem(this.LSK_REFRESH_TOKEN);
    }

    public get activeUser(): Observable<User> {
        return this.activeUser$.pipe(
            filter((user) => !!user),
            map((user) => user as User)
        );
    }

    public isAuthenticated(): Observable<boolean> {
        return this.activeUser$.pipe(map((user) => !!user));
    }

    private isValid(token: string | null | undefined): boolean {
        if (!token) {
            return false;
        }

        const payload = jwtDecode(token) as JwtPayload;
        return (payload.exp ?? 0) * 1000 >= new Date().valueOf();
    }
}
