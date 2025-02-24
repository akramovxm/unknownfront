import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "@services/auth.service";
import {Router} from "@angular/router";
import {ErrorService} from "@services/error.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {VerifyRequest} from "@requests/verify-request";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-verify',
    imports: [
        ReactiveFormsModule,
        MatIcon,
        MatFormField,
        MatInput,
        MatLabel,
        MatError,
        MatButton,
        MatProgressSpinner,
        NgIf,
        TranslatePipe
    ],
    templateUrl: './verify.component.html',
    styleUrl: './verify.component.css'
})
export class VerifyComponent {
    formBuilder = inject(FormBuilder);
    authService = inject(AuthService);
    errorService = inject(ErrorService);
    router = inject(Router);
    snackbar = inject(MatSnackBar);
    breakpointObserverService = inject(BreakpointObserverService);
    translate = inject(TranslateService);

    email = sessionStorage.getItem('email');

    resendLoading = false;

    verifyForm = this.formBuilder.group({
        email: [this.email, [Validators.required]],
        verifyCode: ['', [Validators.required]]
    });

    submitVerifyForm() {
        if (this.verifyForm.invalid) return;

        this.authService.verifyLoading = true;
        this.verifyForm.disable();
        this.authService.verify(<VerifyRequest>this.verifyForm.value)
            .subscribe({
                next: res => {
                    this.authService.verifyLoading = false;
                    this.verifyForm.enable();
                    this.translate.get(['VERIFY_SUCCESS', 'CLOSE']).subscribe(messages => {
                        this.snackbar.open(messages['VERIFY_SUCCESS'], messages['CLOSE'], {duration: 5000});
                    })
                    if (sessionStorage.getItem('verifyType') === 'recovery') {
                        sessionStorage.setItem('verify', String(true));
                        this.router.navigate(['/set-password']);
                    } else {
                        sessionStorage.removeItem('email');
                        sessionStorage.removeItem('verify');
                        sessionStorage.removeItem('verifyType');
                        this.router.navigate(['/login']);
                    }
                },
                error: err => {
                    this.authService.verifyLoading = false;
                    this.verifyForm.enable();
                    this.errorService.onError(err);
                }
            });
    }

    submitResendCode() {
        this.resendLoading = true;
        this.authService.resendCode(this.verifyForm.value.email)
            .subscribe({
                next: res => {
                    this.resendLoading = false;
                    this.translate.get(['SEND_CODE_SUCCESS', 'CLOSE']).subscribe(messages => {
                        this.snackbar.open(messages['SEND_CODE_SUCCESS'], messages['CLOSE'], {duration: 5000});
                    })
                },
                error: err => {
                    this.resendLoading = false;
                    this.errorService.onError(err);
                }
            });
    }

    get titleClass() {
        return this.breakpointObserverService.max320 ? "mat-headline-3" : "mat-headline-2";
    }

    get verifyLoading() {
        return this.authService.verifyLoading;
    }

    get codeError() {
        const verifyCode = this.verifyForm.controls.verifyCode;
        const errors = verifyCode.errors;
        let error = '';
        if (errors?.['required']) {
            error = this.translate.instant('CODE_REQUIRED');;
        }
        return error;
    }
}
