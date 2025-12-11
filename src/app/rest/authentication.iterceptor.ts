import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthenticationService } from "../common/service/authentication.service";
import { switchMap, take } from "rxjs";

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
    const needsAuthorization = req.headers.has('Authorization') && !req.headers.get('Authorization');

    if (!needsAuthorization) {
        return next(req);
    }

    return inject(AuthenticationService).getAccessToken().pipe(
        take(1),
        switchMap((token) => {
            const authenticatedRequest = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + token)});
            return next(authenticatedRequest);
        })
    );
};
