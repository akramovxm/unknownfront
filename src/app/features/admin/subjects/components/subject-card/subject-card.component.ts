import {Component, inject, input} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {AdminSubject} from "@features/admin/subjects/model/admin-subject";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {MatAnchor, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {TitleFormDialogComponent} from "@shared/components/title-form-dialog/title-form-dialog.component";
import {TitleForm} from "@models/title-form";
import {FormBuilder, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {SubjectStateService} from "@features/admin/subjects/services/subject-state.service";

@Component({
    selector: 'app-subject-card',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatCardActions,
        RouterLink,
        TranslatePipe,
        MatAnchor,
        MatIcon,
        MatIconButton,
        MatTooltip
    ],
    templateUrl: './subject-card.component.html',
    styleUrl: './subject-card.component.scss'
})
export class SubjectCardComponent {
    private readonly dialog = inject(MatDialog);
    private readonly formBuilder = inject(FormBuilder);
    private readonly confirmDialogService = inject(ConfirmDialogService);
    private readonly subjectStateService = inject(SubjectStateService);
    private readonly translate = inject(TranslateService);

    readonly subject = input.required<AdminSubject>();

    private dialogRef: MatDialogRef<TitleFormDialogComponent> | undefined;

    readonly form = this.formBuilder.group<TitleForm>({
        titleUz: this.formBuilder.control<string | null>(null, [Validators.required]),
        titleRu: this.formBuilder.control<string | null>(null, [Validators.required])
    })

    onUpdateClick() {
        this.form.controls.titleUz.setValue(this.subject().titleUz);
        this.form.controls.titleRu.setValue(this.subject().titleRu);

        this.dialogRef = this.dialog.open(TitleFormDialogComponent, {autoFocus: false, data: {
            title: 'UPDATE_TOPIC', buttonIcon: 'edit', buttonTitle: 'UPDATE',
            form: this.form, loading: this.subjectStateService.updateLoading,
            onSubmit: () => this.subjectStateService.updateSubject(this.form, this.dialogRef, this.subject().id)
        }});
    }

    onDeleteClick() {
        let message = `"${this.subject().titleUz}" ` + this.translate.instant('DELETE_SUBJECT_CONFIRM');
        if (this.translate.currentLang === 'ru') {
            message = this.translate.instant('DELETE_SUBJECT_CONFIRM') +` "${this.subject().titleRu}"?`;
        }
        this.confirmDialogService.open(
            this.translate.instant('DELETE_SUBJECT'),
            message,
            () => this.subjectStateService.deleteSubject(this.subject().id).subscribe(),
        )
    }

    get lang() {
        return this.translate.currentLang;
    }
}
