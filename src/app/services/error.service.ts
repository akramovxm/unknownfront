import {inject, Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "@services/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    router = inject(Router);
    authService = inject(AuthService);
    snackbar = inject(MatSnackBar);
    translate = inject(TranslateService);

    onError(err: HttpErrorResponse) {
        let message = err.error.message;
        console.log(err);
        this.translate.get('CLOSE').subscribe(close => {
            this.snackbar.open(message, close, {duration: 5000});
        })
    }
}
