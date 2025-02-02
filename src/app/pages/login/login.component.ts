import {Component, inject, signal} from '@angular/core';
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from "@services/auth.service";
import {ErrorService} from "@services/error.service";
import {LoginRequest} from "@requests/login-request";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MediaMatcher} from "@angular/cdk/layout";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";

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
        MatIconButton,
        MatSuffix
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    router = inject(Router);
    formBuilder = inject(FormBuilder);
    authService = inject(AuthService);
    errorService = inject(ErrorService);
    breakpointObserverService = inject(BreakpointObserverService);

    loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    submitLoginForm() {
        if (this.loginForm.invalid) return;

        this.authService.loginLoading = true;
        this.loginForm.disable();
        this.authService.login(<LoginRequest>this.loginForm.value)
            .subscribe({
                next: res => {
                    this.loginForm.enable();
                    this.authService.onLoginSuccess(res.token);
                },
                error: err => {
                    this.authService.loginLoading = false;
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

    get titleClass() {
        return this.breakpointObserverService.max320 ? "mat-headline-3" : "mat-headline-2";
    }

    get loading() {
        return this.authService.loginLoading;
    }

    get emailError() {
        const email = this.loginForm.controls.email;
        const errors = email.errors;
        let error = '';
        if (errors?.['required']) {
            error = "Email is required";
        } else if (errors?.['email']) {
            error = "Email is invalid";
        }
        return error;
    }

    get passwordError() {
        const password = this.loginForm.controls.password;
        const errors = password.errors;
        let error = '';
        if (errors?.['required']) {
            error = "Password is required";
        }
        return error;
    }
}
