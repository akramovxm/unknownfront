import {inject, Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "@services/auth.service";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    router = inject(Router);
    authService = inject(AuthService);
    snackbar = inject(MatSnackBar);

    onError(err: HttpErrorResponse) {
        let message = "An error occurred. Please try again later";
        if (err.status === 404) {
            this.router.navigate(['**'], { skipLocationChange: true });
        } else if (err.status === 0) {
            this.snackbar.open(message, 'Close', {duration: 5000});
        } else {
            message = err.error.message;
            this.snackbar.open(message, 'Close', {duration: 5000});
        }
    }
}
