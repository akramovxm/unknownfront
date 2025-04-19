import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {VerifyForm} from "@features/auth/models/verify-form";
import {ButtonProgressSpinnerComponent} from "@shared/components/button-progress-spinner/button-progress-spinner.component";
import {ErrorMessageService} from "@services/error-message.service";
import {AuthStateService} from "@features/auth/services/auth-state.service";

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
    private readonly authStateService = inject(AuthStateService);
    private readonly errorMessageService = inject(ErrorMessageService);

    constructor() {
        const verify = this.authStateService.getVerify();
        if (verify) {
            this.form.controls.email.setValue(verify.email);
        }
    }

    readonly form = this.formBuilder.group<VerifyForm>({
        email: this.formBuilder.control<string | null>(null, Validators.required),
        verifyCode: this.formBuilder.control<string | null>(null, Validators.required)
    });

    submit() {
        this.authStateService.verify(this.form);
    }

    resendCode() {
        return this.authStateService.resendCode(this.form);
    }

    get loading() {
        return this.authStateService.loading;
    }
    get resendLoading() {
        return this.authStateService.resendLoading;
    }

    get email() {
        return this.form.value.email;
    }
    get codeError() {
        return this.errorMessageService.getMessage(
            this.form.controls.verifyCode,
            [
                {error: 'required', message: 'CODE_REQUIRED'},
                {error: 'incorrect', message: 'CODE_INCORRECT'}
            ]
        );
    }
}
