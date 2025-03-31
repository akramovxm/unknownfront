import {Component, inject, OnInit} from '@angular/core';
import {ContainerComponent} from "@shared/components/container/container.component";
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
import {ButtonProgressSpinnerComponent} from "@shared/components/button-progress-spinner/button-progress-spinner.component";
import {MatAnchor, MatButton} from "@angular/material/button";
import {ProgressBarComponent} from "@shared/components/progress-bar/progress-bar.component";
import {SettingsForm} from "@features/admin/settings/models/settings-form";
import { RouterLink } from '@angular/router';
import {MeStateService} from "@features/admin/settings/services/me-state.service";

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
        ProgressBarComponent,
        MatAnchor,
        RouterLink
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
    private readonly meStateService = inject(MeStateService);
    private readonly errorMessageService = inject(ErrorMessageService);
    readonly boService = inject(BreakpointObserverService);

    readonly form = this.formBuilder.group<SettingsForm>({
        firstName: this.formBuilder.control<string | null>(null),
        lastName: this.formBuilder.control<string | null>(null),
        phoneNumber: this.formBuilder.control<string | null>(null),
        birthDate: this.formBuilder.control<string | null>(null),
    })

    ngOnInit() {
        this.meStateService.getMe(this.form);
    }

    submit() {
        this.meStateService.updateMe(this.form);
    }

    get loading() {
        return this.meStateService.loading;
    }
    get meLoading() {
        return this.meStateService.meLoading;
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
