import {Component, inject, signal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "@services/auth.service";
import {ErrorService} from "@services/error.service";
import {UpdatePasswordRequest} from "@requests/update-password-request";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";

@Component({
    selector: 'app-update-password',
    imports: [
        MatButton,
        MatError,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatProgressSpinner,
        NgIf,
        NgxTrimDirectiveModule,
        ReactiveFormsModule,
        MatSuffix,
    ],
    templateUrl: './update-password.component.html',
    styleUrl: './update-password.component.css'
})
export class UpdatePasswordComponent {
    router = inject(Router);
    formBuilder = inject(FormBuilder);
    authService = inject(AuthService);
    errorService = inject(ErrorService);
    breakpointObserverService = inject(BreakpointObserverService);

    loading = false;

    email = sessionStorage.getItem('email') ?? '';

    updatePasswordForm = this.formBuilder.group({
        email: [this.email, [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    submitUpdatePasswordForm() {
        if (this.updatePasswordForm.invalid) return;

        this.loading = true;
        this.updatePasswordForm.disable();
        this.authService.updatePassword(<UpdatePasswordRequest>this.updatePasswordForm.value)
            .subscribe({
                next: res => {
                    this.loading = false;
                    this.updatePasswordForm.enable();
                    sessionStorage.removeItem('email');
                    sessionStorage.removeItem("emailType");
                    this.router.navigate(['/login']);
                },
                error: err => {
                    this.loading = false;
                    this.updatePasswordForm.enable();
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

    get passwordError() {
        const password = this.updatePasswordForm.controls.password;
        const errors = password.errors;
        let error = '';
        if (errors?.['required']) {
            error = "Password is required";
        }
        return error;
    }
}
