import {Component, inject, OnInit} from '@angular/core';
import {SimpleToolbarComponent} from "@shared/components/simple-toolbar/simple-toolbar.component";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ProgressBarComponent} from "@shared/components/progress-bar/progress-bar.component";
import {ContainerComponent} from "@shared/components/container/container.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {TaskViewCardComponent} from "@features/profile/my-tests/components/task-view-card/task-view-card.component";
import {TaskGroup} from "@features/profile/test/models/task-group";
import {MyTestsStateService} from "@features/profile/my-tests/services/my-tests-state.service";
import {ActivatedRoute} from "@angular/router";
import {MatList, MatListItem, MatListItemTitle} from "@angular/material/list";

@Component({
    selector: 'app-my-tests-details',
    imports: [
        SimpleToolbarComponent,
        TranslatePipe,
        ProgressBarComponent,
        ContainerComponent,
        MatTab,
        MatTabGroup,
        NgForOf,
        TaskViewCardComponent,
        MatList,
        MatListItem,
        MatListItemTitle,
        DatePipe,
        NgIf
    ],
    templateUrl: './my-tests-details.component.html',
    styleUrl: './my-tests-details.component.scss'
})
export class MyTestsDetailsComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly myTestsStateService = inject(MyTestsStateService);
    private readonly translate = inject(TranslateService);

    ngOnInit() {
        const testId = Number(this.activatedRoute.snapshot.paramMap.get('testId'));
        this.myTestsStateService.getById(testId).subscribe();
    }

    trackById(i: number, taskGroup: TaskGroup) {
        return taskGroup.id;
    }

    getSubjectTitle(taskGroup: TaskGroup) {
        return this.lang === 'uz' ? taskGroup.subject.titleUz : taskGroup.subject.titleRu;
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

    getLabel(taskGroup: TaskGroup) {
        let answeredTasks = 0;
        let allTasks = taskGroup.tasks.length;

        taskGroup.tasks.forEach((task) => {
            if (task.selectedAnswer) {
                answeredTasks++;
            }
        })

        const title = this.lang === 'uz' ? taskGroup.subject.titleUz : taskGroup.subject.titleRu;
        return title + ' ' + answeredTasks + '/' + allTasks;
    }

    get testDuration() {
        const test = this.test();
        if (!test) {
            return '';
        }
        let finish = new Date(test.finishTime).getTime();
        let start = new Date(test.startTime).getTime();
        const value = Math.max(Math.floor((finish - start) / 1000), 0);
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        const seconds = value % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    get loading() {
        return this.myTestsStateService.loading;
    }
    get lang() {
        return this.translate.currentLang;
    }
    get test() {
        return this.myTestsStateService.test;
    }
}
