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
import {RegistrationRequest} from "@requests/registration-request";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

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
        MatProgressSpinner,
        MatIconButton,
        TranslatePipe
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'en'},
        provideNativeDateAdapter()
    ],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.css'
})
export class RegistrationComponent {
    router = inject(Router);
    formBuilder = inject(FormBuilder);
    authService = inject(AuthService);
    errorService = inject(ErrorService);
    breakpointObserverService = inject(BreakpointObserverService);
    translate = inject(TranslateService);

    registrationForm = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        phoneNumber: ['', []],
        birthDate: ['', []]
    });

    submitRegistrationForm() {
        if (this.registrationForm.invalid) return;

        this.authService.registrationLoading = true;
        this.registrationForm.disable();
        this.authService.registration(<RegistrationRequest>this.registrationForm.value)
            .subscribe({
                next: res => {
                    this.authService.registrationLoading = false;
                    this.registrationForm.enable();
                    if (this.registrationForm.value.email) {
                        sessionStorage.setItem('email', this.registrationForm.value.email);
                        sessionStorage.setItem('verifyType', 'registration');
                    }
                    this.router.navigate(['/verify']);
                },
                error: (err: HttpErrorResponse) => {
                    this.authService.registrationLoading = false;
                    this.registrationForm.enable();
                    if (err.status === 400) {
                        Object.keys(this.registrationForm.value).forEach(value => {
                            if (err.error.errors[value]) {
                                this.registrationForm.get(value)?.setErrors({ 'exists': true });
                            }
                        })
                        return;
                    }
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
        return this.authService.registrationLoading;
    }

    get firstNameError() {
        const firstName = this.registrationForm.controls.firstName;
        const errors = firstName.errors;
        let error = '';
        if (errors?.['required']) {
            error = this.translate.instant('FIRST_NAME_REQUIRED');
        }
        return error;
    }

    get lastNameError() {
        const lastName = this.registrationForm.controls.lastName;
        const errors = lastName.errors;
        let error = '';
        if (errors?.['required']) {
            error = this.translate.instant('LAST_NAME_REQUIRED');
        }
        return error;
    }

    get phoneNumberError() {
        const phoneNumber = this.registrationForm.controls.phoneNumber;
        const errors = phoneNumber.errors;
        let error = '';
        if (errors?.['mask']) {
            error = this.translate.instant('PHONE_NUMBER_INVALID');
        } else if (errors?.['exists']) {
            error = this.translate.instant('PHONE_NUMBER_EXISTS');
        }
        return error;
    }

    get birthDateError() {
        const birthDate = this.registrationForm.controls.birthDate;
        const errors = birthDate.errors;
        let error = '';
        if (errors?.['matDatepickerParse']) {
            error = this.translate.instant('BIRTH_DATE_INVALID');
        }
        return error;
    }

    get emailError() {
        const email = this.registrationForm.controls.email;
        const errors = email.errors;
        let error = '';
        if (errors?.['required']) {
            error = this.translate.instant('EMAIL_REQUIRED');
        } else if (errors?.['email']) {
            error = this.translate.instant('EMAIL_INVALID');
        } else if (errors?.['exists']) {
            error = this.translate.instant('EMAIL_EXISTS');
        }
        return error;
    }

    get passwordError() {
        const password = this.registrationForm.controls.password;
        const errors = password.errors;
        let error = '';
        if (errors?.['required']) {
            error = this.translate.instant('PASSWORD_REQUIRED');
        }
        return error;
    }
}
