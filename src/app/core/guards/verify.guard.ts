import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthStateService} from "@features/auth/services/auth-state.service";

export const verifyGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authStateService = inject(AuthStateService);

    const verify = authStateService.getVerify();

    let expiresAt: Date | null = null;

    if (verify) {
        expiresAt = new Date(verify.expiresAt);
    }

    return (expiresAt && expiresAt > new Date()) || router.createUrlTree(['/']);
};
