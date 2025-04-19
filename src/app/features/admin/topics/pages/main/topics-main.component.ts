import {Component, inject, OnInit} from '@angular/core';
import {ProgressBarComponent} from "@shared/components/progress-bar/progress-bar.component";
import {ContainerComponent} from "@shared/components/container/container.component";
import {MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle} from "@angular/material/tree";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TopicStateService} from "@features/admin/topics/services/topic-state.service";
import {AdminTreeTopic} from "@features/admin/topics/models/admin-tree-topic";
import {TreeNodeComponent} from "@features/admin/topics/components/tree-node/tree-node.component";
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TitleFormDialogComponent } from '@shared/components/title-form-dialog/title-form-dialog.component';
import { FormBuilder, Validators } from '@angular/forms';
import { TopicForm } from '../../models/topic-form';
import {SimpleToolbarComponent} from "@shared/components/simple-toolbar/simple-toolbar.component";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-topics-main',
    imports: [
        ProgressBarComponent,
        ContainerComponent,
        MatTree,
        MatTreeNode,
        MatIconButton,
        MatTreeNodePadding,
        MatTreeNodeDef,
        MatIcon,
        MatTreeNodeToggle,
        TreeNodeComponent,
        MatButton,
        NgIf,
        TranslatePipe,
        SimpleToolbarComponent
    ],
    templateUrl: './topics-main.component.html',
    styleUrl: './topics-main.component.scss'
})
export class TopicsMainComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly dialog = inject(MatDialog);
    private readonly formBuilder = inject(FormBuilder);
    private readonly topicStateService = inject(TopicStateService);

    private dialogRef: MatDialogRef<TitleFormDialogComponent> | undefined;

    ngOnInit() {
        const subjectId = Number(this.activatedRoute.snapshot.paramMap.get('subjectId'));
        this.form.controls.subjectId.setValue(subjectId);
        this.topicStateService.getTreeTopicsBySubjectId(subjectId).subscribe();
    }

    readonly form = this.formBuilder.group<TopicForm>({
        subjectId: this.formBuilder.control<number | null>(null, [Validators.required]),
        parentId: this.formBuilder.control<number | null>(null),
        titleUz: this.formBuilder.control<string | null>(null, [Validators.required]),
        titleRu: this.formBuilder.control<string | null>(null, [Validators.required])
    })

    onCreateClick() {
        this.dialogRef = this.dialog.open(TitleFormDialogComponent, {autoFocus: false, data: {
            title: 'CREATE_TOPIC', buttonIcon: 'add', buttonTitle: 'CREATE',
            form: this.form, loading: this.topicStateService.createLoading,
            onSubmit: () => this.topicStateService.createTopic(this.form, this.dialogRef)
        }});
    }

    childrenAccessor = (node: AdminTreeTopic) => node.children ?? [];

    hasChild = (_: number, node: AdminTreeTopic) => !!node.children && node.children.length > 0;

    get topics() {
        return this.topicStateService.treeTopics();
    }

    get loading() {
        return this.topicStateService.treeLoading();
    }
}
