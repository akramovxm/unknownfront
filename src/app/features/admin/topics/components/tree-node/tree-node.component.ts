import {Component, input} from '@angular/core';
import {AdminTreeTopic} from "@features/admin/topics/models/admin-tree-topic";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {RouterLink} from "@angular/router";
import {CdkDragHandle} from "@angular/cdk/drag-drop";

@Component({
    selector: 'app-tree-node',
    imports: [
        MatIcon,
        MatIconButton,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        RouterLink,
        CdkDragHandle
    ],
    templateUrl: './tree-node.component.html',
    styleUrl: './tree-node.component.scss'
})
export class TreeNodeComponent {
    topic = input.required<AdminTreeTopic>();
    cdkDragHandleDisabled = input.required<boolean>();
}
