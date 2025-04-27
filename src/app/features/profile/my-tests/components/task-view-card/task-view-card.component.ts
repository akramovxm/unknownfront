import {Component, DoCheck, inject, input, OnChanges, SimpleChanges} from '@angular/core';
import {AnswerSnapshot, TaskSnapshot} from "@features/profile/test/models/task-snapshot";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {NgForOf, NgStyle} from "@angular/common";
import {MatList, MatListItem, MatListItemIcon} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MathjaxService} from "@services/mathjax.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-task-view-card',
    imports: [
        MatCard,
        MatCardContent,
        MatCardHeader,
        NgForOf,
        MatList,
        MatListItem,
        MatIcon,
        NgStyle,
        MatListItemIcon
    ],
    templateUrl: './task-view-card.component.html',
    styleUrl: './task-view-card.component.scss'
})
export class TaskViewCardComponent implements OnChanges, DoCheck {
    private readonly mathjaxService = inject(MathjaxService);
    private readonly translate = inject(TranslateService);

    readonly task = input.required<TaskSnapshot>();

    ngOnChanges(changes: SimpleChanges) {
        this.mathjaxService.renderMath();
    }

    ngDoCheck() {
        if (this.lang !== this.prevLang) {
            this.prevLang = this.lang;
            this.mathjaxService.renderMath();
        }
    }

    getAnswerColor(answer: AnswerSnapshot) {
        return answer.correct ? 'var(--mat-sys-primary)' :
            this.task().selectedAnswer?.id === answer.id ? 'var(--mat-sys-error)' : '';
    }

    getAnswerIcon(answer: AnswerSnapshot) {
        return answer.correct ? 'check_circle' :
            this.task().selectedAnswer?.id === answer.id ? 'cancel' :
                'radio_button_unchecked';
    }

    get lang() {
        return this.translate.currentLang;
    }

    private prevLang = this.lang;
}
