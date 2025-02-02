import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const updatePasswordGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    const email = sessionStorage.getItem('email');
    const emailType = sessionStorage.getItem('emailType');

    return (!!email && emailType === 'recovery') || router.navigate(['/']);
};
