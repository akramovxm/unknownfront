import {Component, inject, OnInit} from '@angular/core';
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
        NgIf
    ],
    templateUrl: './verify.component.html',
    styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit {
    formBuilder = inject(FormBuilder);
    authService = inject(AuthService);
    errorService = inject(ErrorService);
    router = inject(Router);
    snackbar = inject(MatSnackBar);
    breakpointObserverService = inject(BreakpointObserverService);

    email = sessionStorage.getItem('email') ?? '';

    resendLoading = false;

    verifyForm = this.formBuilder.group({
        email: [this.email, [Validators.required]],
        verifyCode: ['', [Validators.required]]
    });

    ngOnInit() {
        this.verifyForm.controls.email.setValue(this.email);
    }

    submitVerifyForm() {
        if (this.verifyForm.invalid) return;

        this.authService.verifyLoading = true;
        this.verifyForm.disable();
        this.authService.verify(<VerifyRequest>this.verifyForm.value)
            .subscribe({
                next: res => {
                    this.authService.verifyLoading = false;
                    this.verifyForm.enable();
                    if (sessionStorage.getItem("emailType") === "recovery") {
                        this.router.navigate(['/update-password']);
                    } else {
                        this.router.navigate(['/login']);
                        sessionStorage.removeItem('email');
                        sessionStorage.removeItem("emailType");
                    }
                    this.snackbar.open(res.message, 'Close', { duration: 5000 });
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
        this.authService.resendCode(this.email)
            .subscribe({
                next: res => {
                    this.resendLoading = false;
                    this.snackbar.open(res.message, 'Yopish', { duration: 5000 })
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
            error = 'Code is required';
        }
        return error;
    }
}
