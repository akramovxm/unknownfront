import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "@services/auth.service";
import {Role} from "@models/role";

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.role() === Role.ADMIN || router.navigate(['/']);
};
