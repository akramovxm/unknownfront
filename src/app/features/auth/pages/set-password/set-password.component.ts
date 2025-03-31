import {Component, inject, OnDestroy, signal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {ButtonProgressSpinnerComponent} from "@shared/components/button-progress-spinner/button-progress-spinner.component";
import {ErrorMessageService} from "@services/error-message.service";
import {AuthStateService} from "@features/auth/services/auth-state.service";
import {SetPasswordForm} from "@features/auth/models/set-password-form";

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
    private readonly formBuilder = inject(FormBuilder);
    private readonly authStateService = inject(AuthStateService);
    private readonly errorMessageService = inject(ErrorMessageService);

    readonly hide = signal<boolean>(true);

    token = sessionStorage.getItem('recoveryToken');

    readonly form = this.formBuilder.group<SetPasswordForm>({
        token: this.formBuilder.control<string | null>(this.token, Validators.required),
        password: this.formBuilder.control<string | null>(null, Validators.required)
    });

    ngOnDestroy() {
        this.authStateService.removeVerifyType();
    }

    submit() {
        this.authStateService.setPassword(this.form);
    }

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    get loading() {
        return this.authStateService.loading;
    }

    get passwordError() {
        return this.errorMessageService.getMessage(
            this.form.controls.password,
            {error: 'required', message: 'PASSWORD_REQUIRED'}
        );
    }
}
