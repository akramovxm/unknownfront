import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {Role} from "@models/role";
import {AuthStateService} from "@features/auth/services/auth-state.service";

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authStateService = inject(AuthStateService);

    return authStateService.isAdmin() || router.navigate(['/']);
};
