import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {Router} from "@angular/router";
import {AuthService} from "@services/auth.service";
import {ErrorService} from "@services/error.service";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";

@Component({
    selector: 'app-account-recovery',
    imports: [
        MatButton,
        MatError,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatProgressSpinner,
        NgIf,
        ReactiveFormsModule,
        NgxTrimDirectiveModule
    ],
    templateUrl: './account-recovery.component.html',
    styleUrl: './account-recovery.component.css'
})
export class AccountRecoveryComponent {
    router = inject(Router);
    formBuilder = inject(FormBuilder);
    authService = inject(AuthService);
    errorService = inject(ErrorService);
    breakpointObserverService = inject(BreakpointObserverService);

    resendLoading = false;

    recoveryForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]]
    });

    submitRecoveryForm() {
        if (this.recoveryForm.invalid) return;

        this.resendLoading = true;
        this.recoveryForm.disable();
        this.authService.resendCode(this.recoveryForm.value.email)
            .subscribe({
                next: res => {
                    this.resendLoading = false;
                    this.recoveryForm.enable();
                    if (this.recoveryForm.value.email) {
                        sessionStorage.setItem('email', this.recoveryForm.value.email);
                        sessionStorage.setItem('emailType', "recovery");
                    }
                    this.router.navigate(['/verify']);
                },
                error: err => {
                    this.resendLoading = false;
                    this.recoveryForm.enable();
                    if (err.status === 400) {
                        Object.keys(this.recoveryForm.value).forEach(value => {
                            if (err.error.errors[value]) {
                                this.recoveryForm.get(value)?.setErrors({ 'notFound': true });
                            }
                        })
                        return;
                    }
                    this.errorService.onError(err);
                }
            });
    }

    get titleClass() {
        return this.breakpointObserverService.max320 ? "mat-headline-3" : "mat-headline-2";
    }

    get emailError() {
        const email = this.recoveryForm.controls.email;
        const errors = email.errors;
        let error = '';
        if (errors?.['required']) {
            error = "Email is required";
        } else if (errors?.['email']) {
            error = "Email is invalid";
        } else if (errors?.['notFound']) {
            error = "Email is not found";
        }
        return error;
    }
}
