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
import {Router} from "@angular/router";
import {AuthService} from "@services/auth.service";
import {ErrorService} from "@services/error.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {TranslatePipe} from "@ngx-translate/core";
import {RegistrationForm} from "@features/auth/models/registration-form";
import {ButtonProgressSpinnerComponent} from "@components/button-progress-spinner/button-progress-spinner.component";
import {ErrorMessageService} from "@services/error-message.service";

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
        {provide: MAT_DATE_LOCALE, useValue: 'en'},
        provideNativeDateAdapter()
    ],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
    private readonly router = inject(Router);
    private readonly formBuilder = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly errorService = inject(ErrorService);
    private readonly errorMessageService = inject(ErrorMessageService);

    readonly loading = signal<boolean>(false);
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
        if (this.form.invalid) return;

        this.loading.set(true);
        this.form.disable();
        this.authService.registration(this.form.value)
            .subscribe({
                next: res => {
                    this.loading.set(false);
                    this.form.enable();
                    if (this.form.value.email) {
                        sessionStorage.setItem('email', this.form.value.email);
                        sessionStorage.setItem('verifyType', 'registration');
                    }
                    this.router.navigate(['/verify']);
                },
                error: (err: HttpErrorResponse) => {
                    this.loading.set(false);
                    this.form.enable();
                    this.errorService.onError(err, this.form, ['exists']);
                }
            });
    }

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
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
