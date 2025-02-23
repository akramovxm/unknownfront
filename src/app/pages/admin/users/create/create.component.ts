import {Component, inject, signal} from '@angular/core';
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {NgxMaskDirective} from "ngx-mask";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {Router} from "@angular/router";
import {ErrorService} from "@services/error.service";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "@services/user.service";
import {UserRequest} from "@requests/user-request";
import {MAT_DATE_LOCALE, MatOption, provideNativeDateAdapter} from "@angular/material/core";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatSelect} from "@angular/material/select";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-create',
    imports: [
        FormsModule,
        MatButton,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatError,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatProgressSpinner,
        MatSuffix,
        NgIf,
        NgxMaskDirective,
        NgxTrimDirectiveModule,
        ReactiveFormsModule,
        MatSlideToggle,
        MatSelect,
        MatOption,
        TranslatePipe,
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'en'},
        provideNativeDateAdapter()
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.css'
})
export class CreateComponent {
    router = inject(Router);
    formBuilder = inject(FormBuilder);
    snackbar = inject(MatSnackBar);
    userService = inject(UserService);
    errorService = inject(ErrorService);
    breakpointObserverService = inject(BreakpointObserverService);
    translate = inject(TranslateService);

    userForm = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', []],
        birthDate: ['', []],
        role: ['', [Validators.required]],
        locked: false
    });

    submitUserForm() {
        if (this.userForm.invalid) return;

        this.userService.loading = true;
        this.userForm.disable();
        this.userService.create(<UserRequest>this.userForm.value)
            .subscribe({
                next: res => {
                    this.userService.loading = false;
                    this.userForm.enable();
                    this.translate.get(['USER_CREATED_SUCCESS', 'CLOSE']).subscribe(messages => {
                        this.snackbar.open(messages['USER_CREATED_SUCCESS'], messages['CLOSE'], {duration: 5000});
                    })
                    this.router.navigate(["/admin/users"]);
                },
                error: (err: HttpErrorResponse) => {
                    this.userService.loading = false;
                    this.userForm.enable();
                    if (err.status === 400) {
                        Object.keys(this.userForm.value).forEach(value => {
                            if (err.error.errors[value]) {
                                this.userForm.get(value)?.setErrors({ 'exists': true });
                            }
                        })
                        return;
                    }
                    this.errorService.onError(err);
                }
            });
    }

    get titleClass() {
        return this.breakpointObserverService.max425 ? "mat-headline-3" : "mat-headline-2";
    }

    get loading() {
        return this.userService.loading;
    }

    get firstNameError() {
        const firstName = this.userForm.controls.firstName;
        const errors = firstName.errors;
        let error = '';
        if (errors?.['required']) {
            error = this.translate.instant('FIRST_NAME_REQUIRED');
        }
        return error;
    }

    get lastNameError() {
        const lastName = this.userForm.controls.lastName;
        const errors = lastName.errors;
        let error = '';
        if (errors?.['required']) {
            error = this.translate.instant('LAST_NAME_REQUIRED');
        }
        return error;
    }

    get phoneNumberError() {
        const phoneNumber = this.userForm.controls.phoneNumber;
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
        const birthDate = this.userForm.controls.birthDate;
        const errors = birthDate.errors;
        let error = '';
        if (errors?.['matDatepickerParse']) {
            error = this.translate.instant('BIRTH_DATE_INVALID');
        }
        return error;
    }

    get emailError() {
        const email = this.userForm.controls.email;
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

    get roleError() {
        const role = this.userForm.controls.role;
        const errors = role.errors;
        let error = '';
        if (errors?.['required']) {
            error = this.translate.instant('ROLE_REQUIRED');
        }
        return error;
    }
}
