import {Component, inject, input} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {TranslatePipe} from "@ngx-translate/core";
import {UserForm} from "@features/admin/users/models/user-form";
import {ErrorMessageService} from "@services/error-message.service";
import { UserStateService } from '../../services/user-state.service';

@Component({
    selector: 'app-user-form',
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
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
    private readonly userStateService = inject(UserStateService);
    private readonly errorMessageService = inject(ErrorMessageService);

    readonly form = input.required<FormGroup<UserForm>>();
    readonly icon = input.required<string>();
    readonly action = input.required<string>();
    readonly submit = input.required<(id?: number | null) => void>();

    onSubmit() {
        if (this.form().controls.id.value) {
            this.submit()(this.form().controls.id.value);
        } else {
            this.submit()();
        }
    }

    get loading() {
        return this.userStateService.loading;
    }

    get firstNameError() {
        return this.errorMessageService.getMessage(
            this.form().controls.firstName,
            {error: 'required', message: 'FIRST_NAME_REQUIRED'}
        );
    }
    get lastNameError() {
        return this.errorMessageService.getMessage(
            this.form().controls.lastName,
            {error: 'required', message: 'LAST_NAME_REQUIRED'}
        );
    }
    get phoneNumberError() {
        return this.errorMessageService.getMessage(
            this.form().controls.phoneNumber,
            [
                {error: 'mask', message: 'PHONE_NUMBER_INVALID'},
                {error: 'exists', message: 'PHONE_NUMBER_EXISTS'}
            ]
        );
    }
    get birthDateError() {
        return this.errorMessageService.getMessage(
            this.form().controls.birthDate,
            {error: 'matDatepickerParse', message: 'BIRTH_DATE_INVALID'}
        );
    }
    get emailError() {
        return this.errorMessageService.getMessage(
            this.form().controls.email,
            [
                {error: 'required', message: 'EMAIL_REQUIRED'},
                {error: 'email', message: 'EMAIL_INVALID'},
                {error: 'exists', message: 'EMAIL_EXISTS'}
            ]
        );
    }
    get roleError() {
        return this.errorMessageService.getMessage(
            this.form().controls.role,
            {error: 'required', message: 'ROLE_REQUIRED'}
        );
    }
}
