import {Component, inject, signal} from '@angular/core';
import { ContainerComponent } from "@shared/components/container/container.component";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UpdatePasswordForm } from '../../models/update-password-form';
import { ErrorMessageService } from '@services/error-message.service';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { ButtonProgressSpinnerComponent } from '@shared/components/button-progress-spinner/button-progress-spinner.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import {MeStateService} from "@features/admin/settings/services/me-state.service";

@Component({
    selector: 'app-update-password',
    imports: [
        ContainerComponent,
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        MatIcon,
        MatError,
        NgIf,
        ButtonProgressSpinnerComponent,
        NgxTrimDirectiveModule,
        MatSuffix,
        MatIconButton,
        MatButton,
        TranslatePipe
    ],
    templateUrl: './update-password.component.html',
    styleUrl: './update-password.component.scss'
})
export class UpdatePasswordComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly meStateService = inject(MeStateService);
    private readonly errorMessageService = inject(ErrorMessageService);

    readonly oldHide = signal<boolean>(true);
    readonly newHide = signal<boolean>(true);

    readonly form = this.formBuilder.group<UpdatePasswordForm>({
        oldPassword: this.formBuilder.control<string | null>(null),
        newPassword: this.formBuilder.control<string | null>(null)
    })

    submit() {
        this.meStateService.updatePassword(this.form);
    }

    clickOld(event: MouseEvent) {
        this.oldHide.set(!this.oldHide());
        event.stopPropagation();
    }
    clickNew(event: MouseEvent) {
        this.newHide.set(!this.newHide());
        event.stopPropagation();
    }

    get loading() {
        return this.meStateService.loading;
    }
    get oldPasswordError() {
        return this.errorMessageService.getMessage(
            this.form.controls.oldPassword,
            [
                {error: 'required', message: 'PASSWORD_REQUIRED'},
                {error: 'incorrect', message: 'PASSWORD_INCORRECT'}
            ]
        );
    }

    get newPasswordError() {
        return this.errorMessageService.getMessage(
            this.form.controls.newPassword,
            {error: 'required', message: 'PASSWORD_REQUIRED'}
        );
    }
}