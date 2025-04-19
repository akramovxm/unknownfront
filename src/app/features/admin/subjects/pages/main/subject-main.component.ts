import {Component, inject, OnInit} from '@angular/core';
import {ContainerComponent} from "@shared/components/container/container.component";
import {SubjectStateService} from "@features/admin/subjects/services/subject-state.service";
import {SubjectCardComponent} from "@features/admin/subjects/components/subject-card/subject-card.component";
import {NgForOf, NgIf} from "@angular/common";
import {SimpleToolbarComponent} from "@shared/components/simple-toolbar/simple-toolbar.component";
import {MatIcon} from "@angular/material/icon";
import {MatCard} from "@angular/material/card";
import {MatRipple} from "@angular/material/core";
import {MatTooltip} from "@angular/material/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {TitleFormDialogComponent} from "@shared/components/title-form-dialog/title-form-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {TitleForm} from "@models/title-form";
import {ProgressBarComponent} from "@shared/components/progress-bar/progress-bar.component";

@Component({
    selector: 'app-subject-main',
    imports: [
        ContainerComponent,
        SubjectCardComponent,
        NgForOf,
        SimpleToolbarComponent,
        MatIcon,
        MatCard,
        MatRipple,
        MatTooltip,
        TranslatePipe,
        ProgressBarComponent,
        NgIf
    ],
    templateUrl: './subject-main.component.html',
    styleUrl: './subject-main.component.scss'
})
export class SubjectMainComponent implements OnInit {
    private readonly dialog = inject(MatDialog);
    private readonly formBuilder = inject(FormBuilder);
    private readonly subjectStateService = inject(SubjectStateService);

    private dialogRef: MatDialogRef<TitleFormDialogComponent> | undefined;

    ngOnInit() {
        this.subjectStateService.getSubjects().subscribe();
    }

    readonly form = this.formBuilder.group<TitleForm>({
        titleUz: this.formBuilder.control<string | null>(null, [Validators.required]),
        titleRu: this.formBuilder.control<string | null>(null, [Validators.required])
    })

    onCreateClick() {
        this.dialogRef = this.dialog.open(TitleFormDialogComponent, {autoFocus: false, data: {
                title: 'CREATE_SUBJECT', buttonIcon: 'add', buttonTitle: 'CREATE',
                form: this.form, loading: this.subjectStateService.createLoading,
                onSubmit: () => this.subjectStateService.createSubject(this.form, this.dialogRef)
            }});
    }

    get loading() {
        return this.subjectStateService.loading;
    }
    get subjects() {
        return this.subjectStateService.subjects;
    }
}
