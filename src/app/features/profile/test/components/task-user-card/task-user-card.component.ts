import {Component, DoCheck, inject, input, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {TaskSnapshot} from "@features/profile/test/models/task-snapshot";
import {MathjaxService} from "@services/mathjax.service";
import {TranslateService} from "@ngx-translate/core";
import {MatRadioButton, MatRadioChange, MatRadioGroup} from "@angular/material/radio";
import {NgForOf, NgIf} from "@angular/common";
import {TestStateService} from "@features/profile/test/services/test-state.service";
import {finalize, tap} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {TestProcessService} from "@features/profile/test/services/test-process.service";
import {TaskGroup} from "@features/profile/test/models/task-group";

@Component({
    selector: 'app-task-user-card',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatRadioGroup,
        MatRadioButton,
        NgForOf,
        MatProgressSpinner,
        NgIf
    ],
    templateUrl: './task-user-card.component.html',
    styleUrl: './task-user-card.component.scss'
})
export class TaskUserCardComponent implements OnInit, OnChanges, DoCheck {
    private readonly mathjaxService = inject(MathjaxService);
    private readonly translate = inject(TranslateService);
    private readonly testStateService = inject(TestStateService);
    private readonly testProcessService = inject(TestProcessService);

    readonly loading = signal<boolean>(false);
    readonly checkedAnswerId = signal<number>(0);

    readonly task = input.required<TaskSnapshot>();
    readonly taskGroup = input.required<TaskGroup>();

    ngOnInit() {
        const selectedAnswer = this.task().selectedAnswer;
        if (selectedAnswer) {
            this.checkedAnswerId.set(selectedAnswer?.id);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.mathjaxService.renderMath();
    }

    ngDoCheck() {
        if (this.lang !== this.prevLang) {
            this.prevLang = this.lang;
            this.mathjaxService.renderMath();
        }
    }

    onAnswerChange(e: MatRadioChange) {
        this.loading.set(true);
        const data = {taskSnapshotId: this.task().id, answerSnapshotId: e.value};
        this.testStateService.selectAnswer(data).pipe(
            tap(res => {
                this.testProcessService.answeredTasksCount.update(v => ++v);
                this.testProcessService.taskGroupTasks.update(v => v.map(t => {
                    if (t.taskGroupId === this.taskGroup().id) {
                        t.answeredTasksCount++;
                    }
                    return t;
                }))
                if (res.selectedAnswer) {
                    this.checkedAnswerId.set(res.selectedAnswer.answerId);
                }
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    get lang() {
        return this.translate.currentLang;
    }

    private prevLang = this.lang;
}
