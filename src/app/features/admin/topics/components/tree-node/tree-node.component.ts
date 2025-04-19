import {Component, inject, input, OnInit} from '@angular/core';
import {AdminTreeTopic} from "@features/admin/topics/models/admin-tree-topic";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TitleFormDialogComponent } from '@shared/components/title-form-dialog/title-form-dialog.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TopicForm } from '../../models/topic-form';
import { TopicStateService } from '../../services/topic-state.service';
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-tree-node',
    imports: [
        MatIcon,
        MatIconButton,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        TranslatePipe
    ],
    templateUrl: './tree-node.component.html',
    styleUrl: './tree-node.component.scss'
})
export class TreeNodeComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly dialog = inject(MatDialog);
    private readonly formBuilder = inject(FormBuilder);
    private readonly confirmDialogService = inject(ConfirmDialogService);
    private readonly topicStateService = inject(TopicStateService);
    private readonly translate = inject(TranslateService);

    readonly topic = input.required<AdminTreeTopic>();

    private dialogRef: MatDialogRef<TitleFormDialogComponent> | undefined;

    readonly createForm = this.formBuilder.group<TopicForm>({
        subjectId: this.formBuilder.control<number | null>(null, [Validators.required]),
        parentId: this.formBuilder.control<number | null>(null),
        titleUz: this.formBuilder.control<string | null>(null, [Validators.required]),
        titleRu: this.formBuilder.control<string | null>(null, [Validators.required])
    })

    readonly updateForm = this.formBuilder.group<TopicForm>({
        subjectId: this.formBuilder.control<number | null>(null, [Validators.required]),
        parentId: this.formBuilder.control<number | null | undefined>(null),
        titleUz: this.formBuilder.control<string | null>(null, [Validators.required]),
        titleRu: this.formBuilder.control<string | null>(null, [Validators.required])
    })

    ngOnInit(): void {
        const subjectId = Number(this.activatedRoute.snapshot.paramMap.get('subjectId'));
        this.updateForm.controls.subjectId.setValue(subjectId);
        this.createForm.controls.subjectId.setValue(subjectId);
        this.createForm.controls.parentId.setValue(this.topic().id);
    }

    onCreateClick() {
        this.dialogRef = this.dialog.open(TitleFormDialogComponent, {autoFocus: false, data: {
            title: 'CREATE_TOPIC', buttonIcon: 'add', buttonTitle: 'CREATE',
            form: this.createForm, loading: this.topicStateService.createLoading,
            onSubmit: () => this.topicStateService.createTopic(this.createForm, this.dialogRef)
        }});
    }

    onUpdateClick() {
        this.updateForm.controls.titleUz.setValue(this.topic().titleUz);
        this.updateForm.controls.titleRu.setValue(this.topic().titleRu);
        this.updateForm.controls.parentId.setValue(this.topic().parent?.id);

        this.dialogRef = this.dialog.open(TitleFormDialogComponent, {autoFocus: false, data: {
            title: 'UPDATE_TOPIC', buttonIcon: 'edit', buttonTitle: 'UPDATE',
            form: this.updateForm, loading: this.topicStateService.updateLoading,
            onSubmit: () => this.topicStateService.updateTopic(this.updateForm, this.dialogRef, this.topic().id)
        }});
    }

    onDeleteClick() {
        let message = `"${this.topic().titleUz}" ` + this.translate.instant('DELETE_TOPIC_CONFIRM');
        if (this.translate.currentLang === 'ru') {
            message = this.translate.instant('DELETE_TOPIC_CONFIRM') +` "${this.topic().titleRu}"?`;
        }
        this.confirmDialogService.open(
            this.translate.instant('DELETE_TOPIC'),
            message,
            () => this.topicStateService.deleteTopic(this.topic().id).subscribe(),
        )
    }

    get title() {
        if (this.translate.currentLang === 'uz') {
            return this.topic().titleUz;
        }
        return this.topic().titleRu;
    }
    
}
