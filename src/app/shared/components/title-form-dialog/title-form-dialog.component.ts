import {Component, inject, WritableSignal} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ErrorMessageService } from '@services/error-message.service';
import { NgIf } from '@angular/common';
import {ButtonProgressSpinnerComponent} from "@shared/components/button-progress-spinner/button-progress-spinner.component";
import {TitleForm} from "@models/title-form";

@Component({
    selector: 'app-title-form-dialog',
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatDialogActions,
        MatDialogClose,
        MatButton,
        MatIcon,
        TranslatePipe,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatError,
        MatInput,
        NgIf,
        ButtonProgressSpinnerComponent
    ],
    templateUrl: './title-form-dialog.component.html',
    styleUrl: './title-form-dialog.component.scss'
})
export class TitleFormDialogComponent {
    private readonly errorMessageService = inject(ErrorMessageService);

    dialogData: {title: string, buttonIcon: string, buttonTitle: string,
        form: FormGroup<TitleForm>, loading: WritableSignal<boolean>, onSubmit: () => void
    } = inject(MAT_DIALOG_DATA);

    get titleUzError() {
        return this.errorMessageService.getMessage(
            this.dialogData.form.controls.titleUz,
            [
                {error: 'required', message: 'TITLE_REQUIRED'},
                {error: 'exists', message: 'TITLE_EXISTS'}
            ]
        );
    }
    get titleRuError() {
        return this.errorMessageService.getMessage(
            this.dialogData.form.controls.titleRu,
            [
                {error: 'required', message: 'TITLE_REQUIRED'},
                {error: 'exists', message: 'TITLE_EXISTS'}
            ]
        );
    }
}