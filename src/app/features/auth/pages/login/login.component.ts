import {Component, inject, signal} from '@angular/core';
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {RouterLink} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {GoogleButtonComponent} from "@features/auth/components/google-button/google-button.component";
import {LoginForm} from "@features/auth/models/login-form";
import {ButtonProgressSpinnerComponent} from "@shared/components/button-progress-spinner/button-progress-spinner.component";
import {PageLoadingService} from "@services/page-loading.service";
import {ErrorMessageService} from "@services/error-message.service";
import {AuthStateService} from "@features/auth/services/auth-state.service";

@Component({
    selector: 'app-login',
    imports: [
        MatFormField,
        NgIf,
        MatInput,
        MatLabel,
        MatError,
        ReactiveFormsModule,
        NgxTrimDirectiveModule,
        MatButton,
        MatIcon,
        MatAnchor,
        RouterLink,
        MatSuffix,
        MatIconButton,
        TranslatePipe,
        GoogleButtonComponent,
        ButtonProgressSpinnerComponent
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly authStateService = inject(AuthStateService);
    private readonly errorMessageService = inject(ErrorMessageService);
    private readonly pageLoadingService = inject(PageLoadingService);

    readonly hide = signal<boolean>(true);

    readonly form = this.formBuilder.group<LoginForm>({
        email: this.formBuilder.control<string | null>(null, [Validators.required, Validators.email]),
        password: this.formBuilder.control<string | null>(null, Validators.required)
    });

    submit() {
        this.authStateService.login(this.form);
    }

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    get loading() {
        return this.authStateService.loading;
    }
    get pageLoading() {
        return this.pageLoadingService.loading;
    }

    get emailError() {
        return this.errorMessageService.getMessage(
            this.form.controls.email,
            [
                {error: 'required', message: 'EMAIL_REQUIRED'},
                {error: 'email', message: 'EMAIL_INVALID'}
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
