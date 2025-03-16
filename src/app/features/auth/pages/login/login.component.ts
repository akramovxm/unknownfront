import {Component, inject, signal} from '@angular/core';
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from "@services/auth.service";
import {ErrorService} from "@services/error.service";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {GoogleButtonComponent} from "@features/auth/components/google-button/google-button.component";
import {LoginForm} from "@features/auth/models/login-form";

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
        MatProgressSpinner,
        MatAnchor,
        RouterLink,
        MatSuffix,
        MatIconButton,
        TranslatePipe,
        GoogleButtonComponent
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    router = inject(Router);
    formBuilder = inject(FormBuilder);
    authService = inject(AuthService);
    errorService = inject(ErrorService);
    translate = inject(TranslateService);

    loginForm = this.formBuilder.group<LoginForm>({
        email: this.formBuilder.control<string | null>(null, [Validators.required, Validators.email]),
        password: this.formBuilder.control<string | null>(null, Validators.required)
    });

    submitLoginForm() {
        if (this.loginForm.invalid) return;

        this.authService.loading.set(true);
        this.loginForm.disable();
        this.authService.login(this.loginForm.value)
            .subscribe({
                next: res => {
                    this.loginForm.enable();
                    this.authService.onLoginSuccess(res.token);
                },
                error: err => {
                    this.authService.loading.set(false);
                    this.loginForm.enable();
                    this.errorService.onError(err);
                }
            });
    }

    hide = signal(true);

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    get loading() {
        return this.authService.loading();
    }

    get emailError() {
        const email = this.loginForm.controls.email;
        const errors = email.errors;
        let error = '';
        if (errors?.['required']) {
            error = this.translate.instant('EMAIL_REQUIRED');
        } else if (errors?.['email']) {
            error = this.translate.instant('EMAIL_INVALID');
        }
        return error;
    }

    get passwordError() {
        const password = this.loginForm.controls.password;
        const errors = password.errors;
        let error = '';
        if (errors?.['required']) {
            error = this.translate.instant('PASSWORD_REQUIRED');
        }
        return error;
    }
}
