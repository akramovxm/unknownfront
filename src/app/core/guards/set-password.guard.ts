import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import { AuthStateService } from '@features/auth/services/auth-state.service';

export const setPasswordGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authStateService = inject(AuthStateService);

    const recovery = authStateService.getRecovery();

    let expiresAt: Date | null = null;

    if (recovery) {
        expiresAt = new Date(recovery.expiresAt);
    }

    return (expiresAt && expiresAt > new Date()) || router.createUrlTree(['/']);
};
