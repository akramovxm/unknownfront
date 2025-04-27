import {Component, inject, input} from '@angular/core';
import {TestSession} from "@features/profile/test/models/test-session";
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {DatePipe, NgForOf} from "@angular/common";
import {TaskGroup} from "@features/profile/test/models/task-group";
import {MatAnchor} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-test-card',
    imports: [
        MatCard,
        MatCardContent,
        TranslatePipe,
        NgForOf,
        DatePipe,
        MatCardActions,
        MatIcon,
        MatAnchor,
        RouterLink
    ],
    templateUrl: './test-card.component.html',
    styleUrl: './test-card.component.scss'
})
export class TestCardComponent {
    private readonly translate = inject(TranslateService);

    readonly test = input.required<TestSession>();

    getSubjectTitle(taskGroup: TaskGroup) {
        return this.translate.currentLang === 'uz' ? taskGroup.subject.titleUz : taskGroup.subject.titleRu;
    }
    getResultBySubject(taskGroup: TaskGroup) {
        let trueAnsweredTasks = 0;
        let allTasks = taskGroup.tasks.length;

        taskGroup.tasks.forEach(task => {
            if (task.selectedAnswer?.correct) {
                trueAnsweredTasks++;
            }
        });

        return trueAnsweredTasks + '/' + allTasks;
    }

    get testDuration() {
        let finish = new Date(this.test().finishTime).getTime();
        let start = new Date(this.test().startTime).getTime();
        const value = Math.max(Math.floor((finish - start) / 1000), 0);
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        const seconds = value % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}
