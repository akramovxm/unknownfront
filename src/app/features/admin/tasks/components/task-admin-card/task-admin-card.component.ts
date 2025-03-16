import {Component, inject, input, OnChanges, output, SimpleChanges} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem, MatListItemIcon} from "@angular/material/list";
import {NgForOf, NgStyle} from "@angular/common";
import {MathjaxService} from "@services/mathjax.service";
import {AdminTask} from "@features/admin/tasks/models/admin-task";
import {MatIconButton} from "@angular/material/button";

@Component({
    selector: 'app-task-admin-card',
    imports: [
        MatCard,
        MatCardContent,
        MatIcon,
        MatList,
        MatListItem,
        MatListItemIcon,
        NgForOf,
        NgStyle,
        MatIconButton,
        MatCardHeader
    ],
    templateUrl: './task-admin-card.component.html',
    styleUrl: './task-admin-card.component.scss'
})
export class TaskAdminCardComponent implements OnChanges {
    private readonly mathjaxService = inject(MathjaxService);

    readonly task = input.required<AdminTask>();
    readonly lang = input.required<string>();
    readonly selected = input<boolean>();
    readonly disabled = input<boolean>();

    readonly checkClick = output<AdminTask>();

    onCheckClick() {
        this.checkClick.emit(this.task());
    }

    ngOnChanges(changes: SimpleChanges) {
        this.mathjaxService.renderMath();
    }
}
