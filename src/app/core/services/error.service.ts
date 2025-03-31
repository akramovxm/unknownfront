import {inject, Injectable} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {SnackbarService} from "@services/snackbar.service";

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    private readonly snackbarService = inject(SnackbarService);

    onError(err: HttpErrorResponse, form?: FormGroup, errors?: string[]) {
        console.log(err);
        switch (err.status) {
            case 0:
                this.snackbarService.open('Server Error');
                break;
            case 401:
                if (err.error.message === 'locked') {
                    this.snackbarService.open('USER_LOCKED');
                }
                this.snackbarService.open(err.error.message);
                break;
            case 400:
                if (form) {
                    Object.entries(form.controls).forEach(([key, control]) => {
                        errors?.forEach(e => {
                            if (e === err.error.errors[key]) {
                                control.setErrors({ [e]: true })
                            }
                        })
                    })
                }
                console.log(form)
                break;
            default:
                this.snackbarService.open(err.error.message);
        }
    }
}
