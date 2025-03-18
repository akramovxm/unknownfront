import {Component, inject, input, OnInit} from '@angular/core';
import {AdminTreeTopic} from "@features/admin/topics/models/admin-tree-topic";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TopicFormDialogComponent } from '../../components/topic-form-dialog/topic-form-dialog.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TopicForm } from '../../models/topic-form';
import { TopicStateService } from '../../services/topic-state.service';
import {ConfirmDialogService} from "@services/confirm-dialog.service";

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
    private readonly dialog = inject(MatDialog);
    private readonly formBuilder = inject(FormBuilder);
    private readonly confirmDialogService = inject(ConfirmDialogService);
    private readonly topicStateService = inject(TopicStateService);
    private readonly translate = inject(TranslateService);

    readonly topic = input.required<AdminTreeTopic>();

    private dialogRef: MatDialogRef<TopicFormDialogComponent> | undefined;

    readonly createForm = this.formBuilder.group<TopicForm>({
        titleUz: this.formBuilder.control<string | null>(null, [Validators.required]),
        titleRu: this.formBuilder.control<string | null>(null, [Validators.required]),
        parentId: this.formBuilder.control<number | null>(null)
    })

    readonly updateForm = this.formBuilder.group<TopicForm>({
        titleUz: this.formBuilder.control<string | null>(null, [Validators.required]),
        titleRu: this.formBuilder.control<string | null>(null, [Validators.required]),
        parentId: this.formBuilder.control<number | null | undefined>(null)
    })

    ngOnInit(): void {
        this.createForm.controls.parentId.setValue(this.topic().id);
    }

    onCreateClick() {
        this.dialogRef = this.dialog.open(TopicFormDialogComponent, {autoFocus: false, data: {
            title: 'CREATE_TOPIC', buttonIcon: 'add', buttonTitle: 'CREATE',
            form: this.createForm, loading: this.topicStateService.createLoading, onSubmit: () => this.onCreateSubmit()
        }});
    }

    onUpdateClick() {
        this.updateForm.controls.titleUz.setValue(this.topic().titleUz);
        this.updateForm.controls.titleRu.setValue(this.topic().titleRu);
        this.updateForm.controls.parentId.setValue(this.topic().parent?.id);

        this.dialogRef = this.dialog.open(TopicFormDialogComponent, {autoFocus: false, data: {
            title: 'UPDATE_TOPIC', buttonIcon: 'edit', buttonTitle: 'UPDATE',
            form: this.updateForm, loading: this.topicStateService.updateLoading, onSubmit: () => this.onUpdateSubmit()
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

    private onCreateSubmit() {
        this.topicStateService.createTopic(this.createForm, this.dialogRef);
    }

    private onUpdateSubmit() {
        this.topicStateService.updateTopic(this.updateForm, this.dialogRef, this.topic().id);
    }

    get title() {
        if (this.translate.currentLang === 'uz') {
            return this.topic().titleUz;
        }
        return this.topic().titleRu;
    }
    
}
