import {Component, inject} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle} from "@angular/material/tree";
import {MatRipple} from "@angular/material/core";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {AdminTreeTopic} from "@features/admin/topics/models/admin-tree-topic";
import {TopicStateService} from "@features/admin/topics/services/topic-state.service";

@Component({
    selector: 'app-topic-select-dialog',
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatIcon,
        MatTree,
        MatTreeNode,
        MatTreeNodePadding,
        MatTreeNodeDef,
        MatIconButton,
        MatTreeNodeToggle,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatRipple,
        TranslatePipe
    ],
    templateUrl: './topic-select-dialog.component.html',
    styleUrl: './topic-select-dialog.component.scss'
})
export class TopicSelectDialogComponent {
    topicStateService = inject(TopicStateService);
    translate = inject(TranslateService);
    dialogRef = inject(MatDialogRef<TopicSelectDialogComponent>);

    onTopicClick(id: number) {
        this.dialogRef.close(id);
    }

    getTopicTitle(topic: AdminTreeTopic) {
        if (this.translate.currentLang === 'uz') {
            return topic.titleUz;
        }
        return topic.titleRu;
    }

    get treeTopics() {
        return this.topicStateService.treeTopics();
    }

    childrenAccessor = (node: AdminTreeTopic) => node.children ?? [];

    hasChild = (_: number, node: AdminTreeTopic) => !!node.children && node.children.length > 0;
}
