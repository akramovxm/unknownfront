import {inject, Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {SnackbarService} from "@services/snackbar.service";

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    router = inject(Router);
    authService = inject(AuthService);
    snackbarService = inject(SnackbarService);

    onError(err: HttpErrorResponse, form?: FormGroup) {
        console.log(err);
        switch (err.status) {
            case 0:
                this.snackbarService.open('Server Error');
                break;
            case 400:
                if (form) {
                    Object.entries(form.controls).forEach(([key, control]) => {
                        if (err.error.errors[key]) {
                            control.setErrors({ 'exists': true });
                        }
                    })
                }
                break;
            default:
                this.snackbarService.open(err.error.message);
        }
    }
}
