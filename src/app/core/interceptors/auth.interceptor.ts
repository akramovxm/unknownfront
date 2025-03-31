import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthStateService} from "@features/auth/services/auth-state.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authStateService = inject(AuthStateService);
    const token = authStateService.getToken();

    const cloneReq = req.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
    })

    return next(cloneReq);
};
