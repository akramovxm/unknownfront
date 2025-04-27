import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthStateService} from "@features/auth/services/auth-state.service";

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authStateService = inject(AuthStateService);

    return authStateService.auth() || router.createUrlTree(['/login']);
};
