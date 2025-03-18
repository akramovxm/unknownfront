import {Component, inject, signal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {Router} from "@angular/router";
import {AuthService} from "@services/auth.service";
import {ErrorService} from "@services/error.service";
import {TranslatePipe} from "@ngx-translate/core";
import {ButtonProgressSpinnerComponent} from "@components/button-progress-spinner/button-progress-spinner.component";
import {ErrorMessageService} from "@services/error-message.service";

@Component({
    selector: 'app-account-recovery',
    imports: [
        MatButton,
        MatError,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        NgIf,
        ReactiveFormsModule,
        NgxTrimDirectiveModule,
        TranslatePipe,
        ButtonProgressSpinnerComponent
    ],
    templateUrl: './account-recovery.component.html',
    styleUrl: './account-recovery.component.scss'
})
export class AccountRecoveryComponent {
    private readonly router = inject(Router);
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly errorService = inject(ErrorService);
    private readonly errorMessageService = inject(ErrorMessageService);

    readonly loading = signal<boolean>(false);

    readonly form = this.formBuilder.group({
        email: this.formBuilder.control<string | null>(null, [Validators.required, Validators.email]),
    });

    submit() {
        if (this.form.invalid) return;

        this.loading.set(true);
        this.form.disable();
        this.authService.resendCode(this.form.value.email)
            .subscribe({
                next: res => {
                    this.loading.set(false);
                    this.form.enable();
                    if (this.form.value.email) {
                        sessionStorage.setItem('email', this.form.value.email);
                        sessionStorage.setItem('verifyType', 'recovery');
                    }
                    this.router.navigate(['/verify']);
                },
                error: err => {
                    this.loading.set(false);
                    this.form.enable();
                    this.errorService.onError(err, this.form, ['notFound']);
                }
            });
    }

    get emailError() {
        return this.errorMessageService.getMessage(
            this.form.controls.email,
            [
                {error: 'required', message: 'EMAIL_REQUIRED'},
                {error: 'email', message: 'EMAIL_INVALID'},
                {error: 'notFound', message: 'EMAIL_NOT_FOUND'}
            ]
        );
    }
}
