import {Component, inject, input} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {Subject} from "@features/profile/subjects/models/subject";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
    TestStartDialogComponent
} from "@features/profile/test/components/test-start-dialog/test-start-dialog.component";
import {TestStateService} from "@features/profile/test/services/test-state.service";
import {FormBuilder} from "@angular/forms";
import {TestStartForm} from "@features/profile/test/models/test-start-form";

@Component({
    selector: 'app-subject-card',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatAnchor,
        MatIcon,
        TranslatePipe,
        RouterLink,
        MatCardActions,
        MatButton
    ],
    templateUrl: './subject-card.component.html',
    styleUrl: './subject-card.component.scss'
})
export class SubjectCardComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly testStateService = inject(TestStateService);
    private readonly translate = inject(TranslateService);

    readonly subject = input.required<Subject>();

    private dialogRef: MatDialogRef<TestStartDialogComponent> | undefined;

    onClickStartTest() {
        this.dialogRef = this.dialog.open(TestStartDialogComponent, {
            autoFocus: false, data: {
                subjectTitle: this.lang === 'uz' ? this.subject().titleUz : this.subject().titleRu,
                onConfirm: () => this.start({
                    firstSubjectId: this.subject().id, language: this.lang
                })
            }
        });
    }

    start(data: { firstSubjectId: number, secondSubjectId?: number, language: string }) {
        if (this.dialogRef) {
            this.dialogRef.disableClose = true;
        }
        const form = this.formBuilder.group<TestStartForm>({
            firstSubjectId: this.formBuilder.control(data.firstSubjectId),
            secondSubjectId: this.formBuilder.control(data.secondSubjectId || null),
            language: this.formBuilder.control(data.language)
        })
        this.testStateService.start(form).subscribe({
            next: res => {
                if (this.dialogRef) {
                    this.dialogRef.disableClose = false;
                    this.dialogRef.close();
                }
                this.router.navigate(['/profile/test']);
            },
            error: err => {
                if (this.dialogRef) {
                    this.dialogRef.disableClose = false;
                }
            }
        })
    }

    get lang() {
        return this.translate.currentLang;
    }
    get startDisabled() {
        return this.testStateService.testSession() || this.testStateService.loading();
    }
}
