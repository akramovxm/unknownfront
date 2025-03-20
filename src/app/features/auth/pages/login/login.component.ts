import {Component, inject, signal} from '@angular/core';
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {RouterLink} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from "@services/auth.service";
import {ErrorService} from "@services/error.service";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {GoogleButtonComponent} from "@features/auth/components/google-button/google-button.component";
import {LoginForm} from "@features/auth/models/login-form";
import {ButtonProgressSpinnerComponent} from "@components/button-progress-spinner/button-progress-spinner.component";
import {PageLoadingService} from "@services/page-loading.service";
import {ErrorMessageService} from "@services/error-message.service";
import { SnackbarService } from '@services/snackbar.service';

@Component({
    selector: 'app-login',
    imports: [
        MatFormField,
        NgIf,
        MatInput,
        MatLabel,
        MatError,
        ReactiveFormsModule,
        NgxTrimDirectiveModule,
        MatButton,
        MatIcon,
        MatAnchor,
        RouterLink,
        MatSuffix,
        MatIconButton,
        TranslatePipe,
        GoogleButtonComponent,
        ButtonProgressSpinnerComponent
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly errorService = inject(ErrorService);
    private readonly errorMessageService = inject(ErrorMessageService);
    private readonly pageLoadingService = inject(PageLoadingService);
    private readonly snackbarService = inject(SnackbarService);

    readonly loading = signal<boolean>(false);
    readonly hide = signal<boolean>(true);

    readonly form = this.formBuilder.group<LoginForm>({
        email: this.formBuilder.control<string | null>(null, [Validators.required, Validators.email]),
        password: this.formBuilder.control<string | null>(null, Validators.required)
    });

    submit() {
        if (this.form.invalid) return;

        this.loading.set(true);
        this.form.disable();
        this.authService.login(this.form.value)
            .subscribe({
                next: res => {
                    this.form.enable();
                    this.authService.onLoginSuccess(res.token, this.loading);
                },
                error: err => {
                    this.loading.set(false);
                    this.form.enable();
                    if (err.error.errors === null) {
                        this.snackbarService.open("EMAIL_PASSWORD_INCORRECT");
                    }
                    this.errorService.onError(err);
                }
            });
    }

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    get pageLoading() {
        return this.pageLoadingService.loading();
    }

    get emailError() {
        return this.errorMessageService.getMessage(
            this.form.controls.email,
            [
                {error: 'required', message: 'EMAIL_REQUIRED'},
                {error: 'email', message: 'EMAIL_INVALID'}
            ]
        );
    }
    get passwordError() {
        return this.errorMessageService.getMessage(
            this.form.controls.password,
            {error: 'required', message: 'PASSWORD_REQUIRED'}
        );
    }
}
