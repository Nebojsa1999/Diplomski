import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, of, switchMap, tap } from "rxjs";
import { filter, map } from "rxjs/operators";
import { SignInResponse } from "../../rest/authentication/authentication.model";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AuthenticationClient } from "../../rest/authentication/authentication-client";
import { User } from "../../rest/user/user.model";
import { NotificationService } from "./notification.service";

interface JwtWithRoles extends JwtPayload {
    role?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private readonly TOKEN = "TOKEN";
    private refreshToken: string | null = null;
    private activeUser$ = new BehaviorSubject<User | null>(null);
    private accessToken$ = new BehaviorSubject<string | null>(null);
    private role$ = new BehaviorSubject<string | null>(null);

    constructor(private authClient: AuthenticationClient, private notificationService: NotificationService) {
        this.refreshToken = localStorage.getItem(this.TOKEN) ?? null;
        if (this.isValid(this.refreshToken)) {
            this.authClient.refreshToken(this.refreshToken as string).pipe(
                map((response) => response.data),
                catchError((error) => {
                    this.notificationService.showError(error);
                    this.logout();
                    return of(null);
                })
            ).subscribe((response) => {
                if (!response || !response.user) {
                    this.logout();
                    return;
                }

                this.setAuthentication(response);
            })
        } else {
            this.logout();
        }
    }

    private loadRolesFromToken(token: string | null) {
        if (!token) {
            this.role$.next(null);
            return;
        }

        try {
            const decoded = jwtDecode<JwtWithRoles>(token);
            this.role$.next(decoded.role ?? '');
        } catch {
            this.role$.next(null);
        }
    }

    public setAuthentication(response: SignInResponse) {
        this.refreshToken = response.refreshToken;
        this.accessToken$.next(response.token);

        localStorage.setItem(this.TOKEN, this.refreshToken);
        this.activeUser$.next(response.user);

        this.loadRolesFromToken(response.token);
    }

    public logout() {
        this.refreshToken = null;
        localStorage.removeItem(this.TOKEN);
        this.activeUser$.next(null)
        this.accessToken$.next(null);
        this.role$.next(null);
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

    public updateCurrentUser(user: User) {
        if (!user) {
            return;
        }

        this.activeUser$.next(user)
    }

    getAccessToken(): Observable<string> {
        return this.accessToken$.pipe(
            switchMap(token => {
                if (token && this.isValid(token)) {
                    return of(token);
                }

                if (!this.isValid(this.refreshToken)) {
                    this.logout();
                    return EMPTY;
                }

                return this.authClient.refreshToken(this.refreshToken!).pipe(
                    map(response => response.data),
                    catchError(() => {
                        this.logout();
                        return EMPTY;
                    }),
                    tap((response) => this.loadRolesFromToken(response?.token ?? '')),
                    map(response => response?.token ?? '')
                );
            }),
            filter(token => !!token)
        );
    }

    public hasRole(role: string): boolean {
        return this.role$.value?.includes(role) ?? false;
    }

    private isValid(token: string | null | undefined): boolean {
        if (!token) return false;

        try {
            const payload = jwtDecode<JwtPayload>(token);
            return (payload.exp ?? 0) * 1000 >= Date.now();
        } catch {
            return false;
        }
    }
}
