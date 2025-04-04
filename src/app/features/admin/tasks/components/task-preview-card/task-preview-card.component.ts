import {Component, inject, input, OnChanges, SimpleChanges} from '@angular/core';
import {MathjaxService} from "@services/mathjax.service";
import {NgForOf, NgStyle} from "@angular/common";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatList, MatListItem, MatListItemIcon} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {AdminAnswer} from "@features/admin/tasks/models/admin-task";

@Component({
    selector: 'app-task-preview-card',
    imports: [
        NgForOf,
        MatCard,
        MatCardContent,
        MatList,
        MatListItem,
        MatIcon,
        MatListItemIcon,
        NgStyle,
        MatCardHeader
    ],
    templateUrl: './task-preview-card.component.html',
    styleUrl: './task-preview-card.component.scss',
})
export class TaskPreviewCardComponent implements OnChanges {
    private readonly mathjaxService = inject(MathjaxService);

    readonly content = input.required<string | null | undefined>();
    readonly answers = input.required<AdminAnswer[]>();
    readonly lang = input.required<string>();
    readonly id = input<number>();
    readonly rowAnswers = input<boolean | null>();

    ngOnChanges(changes: SimpleChanges) {
        this.mathjaxService.renderMath();
    }

    trackByAnswer(index: number, answer: AdminAnswer) {
        return answer.id;
    }
}
