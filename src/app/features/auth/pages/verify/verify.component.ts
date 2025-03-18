import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "@services/auth.service";
import {Router} from "@angular/router";
import {ErrorService} from "@services/error.service";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {VerifyForm} from "@features/auth/models/verify-form";
import {ButtonProgressSpinnerComponent} from "@components/button-progress-spinner/button-progress-spinner.component";
import {ErrorMessageService} from "@services/error-message.service";
import {SnackbarService} from "@services/snackbar.service";

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
        TranslatePipe,
        ButtonProgressSpinnerComponent
    ],
    templateUrl: './verify.component.html',
    styleUrl: './verify.component.scss'
})
export class VerifyComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly errorService = inject(ErrorService);
    private readonly router = inject(Router);
    private readonly snackbarService = inject(SnackbarService);
    private readonly errorMessageService = inject(ErrorMessageService);

    readonly resendLoading = signal<boolean>(false);
    readonly verifyLoading = signal<boolean>(false);

    email = sessionStorage.getItem('email');

    readonly form = this.formBuilder.group<VerifyForm>({
        email: this.formBuilder.control<string | null>(this.email, Validators.required),
        verifyCode: this.formBuilder.control<string | null>(null, Validators.required)
    });

    submit() {
        if (this.form.invalid) return;

        this.verifyLoading.set(true);
        this.form.disable();
        this.authService.verify(this.form.value)
            .subscribe({
                next: res => {
                    this.verifyLoading.set(false);
                    this.form.enable();
                    this.snackbarService.open('VERIFY_SUCCESS');
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
                    this.verifyLoading.set(false);
                    this.form.enable();
                    this.errorService.onError(err);
                }
            });
    }

    submitResendCode() {
        this.resendLoading.set(true);
        this.authService.resendCode(this.form.value.email)
            .subscribe({
                next: res => {
                    this.resendLoading.set(false);
                    this.snackbarService.open('SEND_CODE_SUCCESS');
                },
                error: err => {
                    this.resendLoading.set(false);
                    this.errorService.onError(err);
                }
            });
    }

    get loading() {
        return this.verifyLoading();
    }

    get codeError() {
        return this.errorMessageService.getMessage(
            this.form.controls.verifyCode,
            {error: 'required', message: 'CODE_REQUIRED'}
        );
    }
}
