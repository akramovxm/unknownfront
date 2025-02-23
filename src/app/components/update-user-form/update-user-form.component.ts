import {Component, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MAT_DATE_LOCALE, MatOption, provideNativeDateAdapter} from "@angular/material/core";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSelect} from "@angular/material/select";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgIf} from "@angular/common";
import {NgxMaskDirective} from "ngx-mask";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "@services/user.service";
import {ErrorService} from "@services/error.service";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {UserRequest} from "@requests/user-request";
import {HttpErrorResponse} from "@angular/common/http";
import {AdminUser} from "@entities/admin-user";
import {UserSelectionService} from "@services/user-selection.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-update-user-form',
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
        MatOption,
        MatProgressSpinner,
        MatSelect,
        MatSlideToggle,
        MatSuffix,
        NgIf,
        NgxMaskDirective,
        NgxTrimDirectiveModule,
        ReactiveFormsModule,
        TranslatePipe
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'en'},
        provideNativeDateAdapter()
    ],
    templateUrl: './update-user-form.component.html',
    styleUrl: './update-user-form.component.css'
})
export class UpdateUserFormComponent implements OnInit {
    router = inject(Router);
    formBuilder = inject(FormBuilder);
    snackbar = inject(MatSnackBar);
    userService = inject(UserService);
    errorService = inject(ErrorService);
    breakpointObserverService = inject(BreakpointObserverService);
    userSelectionService = inject(UserSelectionService);
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

    @Input({required: true})
    user!: AdminUser;

    ngOnInit() {
        this.userForm.controls.email.disable();

        this.userForm.controls.firstName.setValue(this.user.firstName);
        this.userForm.controls.lastName.setValue(this.user.lastName);
        this.userForm.controls.email.setValue(this.user.email);
        this.userForm.controls.phoneNumber.setValue(this.user.phoneNumber);
        this.userForm.controls.phoneNumber.setValue(this.user.phoneNumber);
        this.userForm.controls.birthDate.setValue(this.user.birthDate);
        this.userForm.controls.role.setValue(this.user.role);
        this.userForm.controls.locked.setValue(this.user.locked);
    }

    submitUserForm() {
        if (this.userForm.invalid) return;

        this.userService.loading = true;
        this.userForm.disable();
        this.userService.update(<UserRequest>this.userForm.value, this.user.id)
            .subscribe({
                next: res => {
                    this.userService.loading = false;
                    this.userForm.enable();
                    this.translate.get(['USER_UPDATED_SUCCESS', 'CLOSE']).subscribe(messages => {
                        this.snackbar.open(messages['USER_UPDATED_SUCCESS'], messages['CLOSE'], {duration: 5000});
                    })
                    this.userSelectionService.update(res.data);
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
        return this.breakpointObserverService.max320 ? "mat-headline-3" : "mat-headline-2";
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
