import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const verifyGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    const email = sessionStorage.getItem('email');

    return !!email || router.navigate(['/']);
};
