import {Component, inject, OnDestroy, signal} from '@angular/core';
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
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-set-password',
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
        TranslatePipe,
    ],
    templateUrl: './set-password.component.html',
    styleUrl: './set-password.component.scss'
})
export class SetPasswordComponent implements OnDestroy {
    router = inject(Router);
    formBuilder = inject(FormBuilder);
    authService = inject(AuthService);
    errorService = inject(ErrorService);
    translate = inject(TranslateService);

    loading = false;

    email = sessionStorage.getItem('email');

    setPasswordForm = this.formBuilder.group({
        email: this.formBuilder.control<string | null>(this.email, Validators.required),
        password: this.formBuilder.control<string | null>(null, Validators.required)
    });

    ngOnDestroy() {
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('verify');
        sessionStorage.removeItem('verifyType');
    }

    submitSetPasswordForm() {
        if (this.setPasswordForm.invalid) return;

        this.loading = true;
        this.setPasswordForm.disable();
        this.authService.setPassword(this.setPasswordForm.value)
            .subscribe({
                next: res => {
                    this.loading = false;
                    this.setPasswordForm.enable();
                    sessionStorage.removeItem('email');
                    sessionStorage.removeItem('verify');
                    sessionStorage.removeItem('verifyType');
                    this.router.navigate(['/login']);
                },
                error: err => {
                    this.loading = false;
                    this.setPasswordForm.enable();
                    this.errorService.onError(err);
                }
            });
    }

    hide = signal(true);

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    get passwordError() {
        const password = this.setPasswordForm.controls.password;
        const errors = password.errors;
        let error = '';
        if (errors?.['required']) {
            error = this.translate.instant('PASSWORD_REQUIRED');
        }
        return error;
    }
}
