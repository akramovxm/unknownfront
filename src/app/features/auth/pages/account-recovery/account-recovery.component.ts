import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {TranslatePipe} from "@ngx-translate/core";
import {ButtonProgressSpinnerComponent} from "@shared/components/button-progress-spinner/button-progress-spinner.component";
import {ErrorMessageService} from "@services/error-message.service";
import {EmailForm} from "@features/auth/models/email-form";
import {AuthStateService} from "@features/auth/services/auth-state.service";

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
    private readonly formBuilder = inject(FormBuilder);
    private readonly authStateService = inject(AuthStateService);
    private readonly errorMessageService = inject(ErrorMessageService);

    readonly form = this.formBuilder.group<EmailForm>({
        email: this.formBuilder.control<string | null>(null, [Validators.required, Validators.email]),
    });

    submit() {
        this.authStateService.recovery(this.form);
    }

    get loading() {
        return this.authStateService.loading;
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
