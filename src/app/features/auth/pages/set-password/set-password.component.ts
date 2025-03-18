import {Component, inject, OnDestroy, signal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "@services/auth.service";
import {ErrorService} from "@services/error.service";
import {TranslatePipe} from "@ngx-translate/core";
import {ButtonProgressSpinnerComponent} from "@components/button-progress-spinner/button-progress-spinner.component";
import {ErrorMessageService} from "@services/error-message.service";

@Component({
    selector: 'app-set-password',
    imports: [
        MatButton,
        MatError,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        NgIf,
        NgxTrimDirectiveModule,
        ReactiveFormsModule,
        MatSuffix,
        TranslatePipe,
        ButtonProgressSpinnerComponent,
    ],
    templateUrl: './set-password.component.html',
    styleUrl: './set-password.component.scss'
})
export class SetPasswordComponent implements OnDestroy {
    private readonly router = inject(Router);
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly errorService = inject(ErrorService);
    private readonly errorMessageService = inject(ErrorMessageService);

    readonly loading = signal<boolean>(false);
    readonly hide = signal<boolean>(true);

    email = sessionStorage.getItem('email');

    readonly form = this.formBuilder.group({
        email: this.formBuilder.control<string | null>(this.email, Validators.required),
        password: this.formBuilder.control<string | null>(null, Validators.required)
    });

    ngOnDestroy() {
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('verify');
        sessionStorage.removeItem('verifyType');
    }

    submit() {
        if (this.form.invalid) return;

        this.loading.set(true);
        this.form.disable();
        this.authService.setPassword(this.form.value)
            .subscribe({
                next: res => {
                    this.loading.set(false);
                    this.form.enable();
                    sessionStorage.removeItem('email');
                    sessionStorage.removeItem('verify');
                    sessionStorage.removeItem('verifyType');
                    this.router.navigate(['/login']);
                },
                error: err => {
                    this.loading.set(false);
                    this.form.enable();
                    this.errorService.onError(err);
                }
            });
    }

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    get passwordError() {
        return this.errorMessageService.getMessage(
            this.form.controls.password,
            {error: 'required', message: 'PASSWORD_REQUIRED'}
        );
    }
}
