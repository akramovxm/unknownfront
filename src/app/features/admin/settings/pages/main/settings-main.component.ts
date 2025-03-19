import {Component, inject, OnInit, signal} from '@angular/core';
import {ContainerComponent} from "@components/container/container.component";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {TranslatePipe} from "@ngx-translate/core";
import {ErrorMessageService} from "@services/error-message.service";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {NgxMaskDirective} from "ngx-mask";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {MatIcon} from "@angular/material/icon";
import {ButtonProgressSpinnerComponent} from "@components/button-progress-spinner/button-progress-spinner.component";
import {MatButton} from "@angular/material/button";
import {MeService} from "@services/me.service";
import {ErrorService} from "@services/error.service";
import {User} from "@models/user";
import {ProgressBarComponent} from "@components/progress-bar/progress-bar.component";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarService} from "@services/snackbar.service";
import {SettingsForm} from "@features/admin/settings/models/settings-form";

@Component({
    selector: 'app-settings-main',
    imports: [
        ContainerComponent,
        ReactiveFormsModule,
        MatError,
        MatFormField,
        MatInput,
        MatLabel,
        NgIf,
        NgxTrimDirectiveModule,
        TranslatePipe,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatSuffix,
        NgxMaskDirective,
        MatIcon,
        ButtonProgressSpinnerComponent,
        MatButton,
        ProgressBarComponent
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'ru'},
        provideNativeDateAdapter()
    ],
    templateUrl: './settings-main.component.html',
    styleUrl: './settings-main.component.scss'
})
export class SettingsMainComponent implements OnInit {
    private readonly formBuilder = inject(FormBuilder);
    private readonly meService = inject(MeService);
    private readonly errorService = inject(ErrorService);
    private readonly errorMessageService = inject(ErrorMessageService);
    private readonly snackbarService = inject(SnackbarService);
    readonly boService = inject(BreakpointObserverService);

    readonly loading = signal<boolean>(false);
    readonly meLoading = signal<boolean>(false);

    readonly form = this.formBuilder.group<SettingsForm>({
        firstName: this.formBuilder.control<string | null>(null),
        lastName: this.formBuilder.control<string | null>(null),
        phoneNumber: this.formBuilder.control<string | null>(null),
        birthDate: this.formBuilder.control<string | null>(null),
    })

    ngOnInit() {
        this.getMe();
    }

    submit() {
        this.updateMe();
    }

    getMe() {
        this.meLoading.set(true);
        this.form.disable();
        this.meService.getMe().subscribe({
            next: res => {
                this.meLoading.set(false);
                this.form.enable();
                this.setFormValues(res.data);
            },
            error: err => {
                this.meLoading.set(false);
                this.form.enable();
                this.errorService.onError(err);
            }
        })
    }

    updateMe() {
        if (this.form.invalid) return;

        this.loading.set(true);
        this.form.disable();

        this.meService.updateMe(this.form.value)
            .subscribe({
                next: res => {
                    this.loading.set(false);
                    this.form.enable();
                    this.snackbarService.open('USER_UPDATED_SUCCESS');
                },
                error: (err: HttpErrorResponse) => {
                    this.loading.set(false);
                    this.form.enable();
                    this.errorService.onError(err, this.form, ['exists']);
                }
            });
    }

    setFormValues(user: User) {
        this.form.controls.firstName.setValue(user.firstName);
        this.form.controls.lastName.setValue(user.lastName);
        this.form.controls.phoneNumber.setValue(user.phoneNumber);
        this.form.controls.birthDate.setValue(user.birthDate);
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
}
