import {Component, inject, signal} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxMaskDirective} from "ngx-mask";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {TranslatePipe} from "@ngx-translate/core";
import {RegistrationForm} from "@features/auth/models/registration-form";
import {ButtonProgressSpinnerComponent} from "@shared/components/button-progress-spinner/button-progress-spinner.component";
import {ErrorMessageService} from "@services/error-message.service";
import {AuthStateService} from "@features/auth/services/auth-state.service";

@Component({
    selector: 'app-registration',
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
        NgxMaskDirective,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatDatepicker,
        MatSuffix,
        MatIconButton,
        TranslatePipe,
        ButtonProgressSpinnerComponent
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'ru'},
        provideNativeDateAdapter()
    ],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly authStateService = inject(AuthStateService);
    private readonly errorMessageService = inject(ErrorMessageService);

    readonly hide = signal<boolean>(true);

    readonly form = this.formBuilder.group<RegistrationForm>({
        firstName: this.formBuilder.control<string | null>(null, Validators.required),
        lastName: this.formBuilder.control<string | null>(null, Validators.required),
        email: this.formBuilder.control<string | null>(null, [Validators.required, Validators.email]),
        password: this.formBuilder.control<string | null>(null, Validators.required),
        phoneNumber: this.formBuilder.control<string | null>(null),
        birthDate: this.formBuilder.control<string | null>(null)
    });

    submit() {
        this.authStateService.registration(this.form);
    }

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    get loading() {
        return this.authStateService.loading;
    }

    get firstNameError() {
        return this.errorMessageService.getMessage(
            this.form.controls.firstName,
            {error: 'required', message: 'FIRST_NAME_REQUIRED'}
        );
    }
    get lastNameError() {
        return this.errorMessageService.getMessage(
            this.form.controls.lastName,
            {error: 'required', message: 'LAST_NAME_REQUIRED'}
        );
    }
    get phoneNumberError() {
        return this.errorMessageService.getMessage(
            this.form.controls.phoneNumber,
            [
                {error: 'mask', message: 'PHONE_NUMBER_INVALID'},
                {error: 'exists', message: 'PHONE_NUMBER_EXISTS'}
            ]
        );
    }
    get birthDateError() {
        return this.errorMessageService.getMessage(
            this.form.controls.birthDate,
            {error: 'matDatepickerParse', message: 'BIRTH_DATE_INVALID'}
        );
    }
    get emailError() {
        return this.errorMessageService.getMessage(
            this.form.controls.email,
            [
                {error: 'required', message: 'EMAIL_REQUIRED'},
                {error: 'email', message: 'EMAIL_INVALID'},
                {error: 'exists', message: 'EMAIL_EXISTS'}
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
