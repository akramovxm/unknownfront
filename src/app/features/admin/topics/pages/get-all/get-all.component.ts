import {Component, inject, OnInit, viewChild} from '@angular/core';
import {ProgressBarComponent} from "@components/progress-bar/progress-bar.component";
import {ContainerComponent} from "@components/container/container.component";
import {MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle} from "@angular/material/tree";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TopicStateService} from "@features/admin/topics/services/topic-state.service";
import {AdminTreeTopic} from "@features/admin/topics/models/admin-tree-topic";
import {TreeNodeComponent} from "@features/admin/topics/components/tree-node/tree-node.component";

@Component({
    selector: 'app-get-all',
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
    ],
    templateUrl: './get-all.component.html',
    styleUrl: './get-all.component.scss'
})
export class GetAllComponent implements OnInit {
    topicStateService = inject(TopicStateService);

    tree = viewChild<MatTree<AdminTreeTopic>>('tree');

    ngOnInit() {
        this.topicStateService.getTreeTopics().subscribe();
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
