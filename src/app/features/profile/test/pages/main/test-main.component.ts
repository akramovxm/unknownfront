import {Component, inject, OnInit} from '@angular/core';
import {ContainerComponent} from "@shared/components/container/container.component";
import {SimpleToolbarComponent} from "@shared/components/simple-toolbar/simple-toolbar.component";
import {TestStateService} from "@features/profile/test/services/test-state.service";
import {NgForOf} from "@angular/common";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {TaskGroup} from "@features/profile/test/models/task-group";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ProgressBarComponent} from "@shared/components/progress-bar/progress-bar.component";
import {TaskUserCardComponent} from "@features/profile/test/components/task-user-card/task-user-card.component";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TestProcessService} from "@features/profile/test/services/test-process.service";
import {FormatTimePipe} from "../../../../../core/pipes/format-time.pipe";
import {MatProgressBar} from "@angular/material/progress-bar";
import {TestSession} from "@features/profile/test/models/test-session";
import {TaskGroupTasksCount} from "@features/profile/test/models/task-group-tasks-count";
import {Router} from "@angular/router";
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {finalize, tap} from "rxjs";

@Component({
    selector: 'app-test-main',
    imports: [
        ContainerComponent,
        SimpleToolbarComponent,
        MatTab,
        MatTabGroup,
        NgForOf,
        ProgressBarComponent,
        TaskUserCardComponent,
        MatButton,
        TranslatePipe,
        MatIcon,
        FormatTimePipe,
        MatProgressBar
    ],
    templateUrl: './test-main.component.html',
    styleUrl: './test-main.component.scss'
})
export class TestMainComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly confirmDialogService = inject(ConfirmDialogService);
    private readonly testStateService = inject(TestStateService);
    private readonly testProcessService = inject(TestProcessService);
    private readonly translate = inject(TranslateService);



    ngOnInit() {
        this.testStateService.getTestCurrentUser().subscribe(res => {
            if (res.data) {
                this.startSession(res.data);
            } else {
                this.router.navigate(['/profile']);
            }
        });
    }

    startSession(testSession: TestSession) {
        this.testProcessService.timeLeft.set(-1);
        this.testProcessService.start(testSession.endTime);
        let answeredTasks = 0;
        let allTasks = 0;
        let taskGroupTasks: TaskGroupTasksCount[] = [];
        testSession.taskGroups.forEach(taskGroup => {
            const obj = {
                taskGroupId: taskGroup.id,
                answeredTasksCount: 0,
            };
            taskGroup.tasks.forEach(task => {
                allTasks++;
                if (task.selectedAnswer) {
                    answeredTasks++;
                    obj.answeredTasksCount++;
                }
            });
            taskGroupTasks.push(obj);
        });
        this.testProcessService.answeredTasksCount.set(answeredTasks);
        this.testProcessService.allTasksCount.set(allTasks);
        this.testProcessService.taskGroupTasks.set(taskGroupTasks);
    }

    onFinishClick() {
        let message = this.translate.instant('FINISH_TEST_CONFIRM');
        const answeredTasksCount = this.testProcessService.answeredTasksCount();
        const allTasksCount = this.testProcessService.allTasksCount();

        if (answeredTasksCount !== allTasksCount) {
            message = this.translate.instant('NOT_ANSWER_ALL') +
                ` (${answeredTasksCount}/${allTasksCount}). `
                + this.translate.instant('FINISH_TEST_CONFIRM');
        }

        this.confirmDialogService.open(
            this.translate.instant('FINISH_TEST'),
            message,
            () => this.finishTest()
        );
    }

    finishTest() {
        this.confirmDialogService.loading.set(true);
        this.confirmDialogService.setDialogDisableClose(true);
        this.testStateService.finish().pipe(
            tap(res => {
                this.confirmDialogService.dialogRef?.close();
            }),
            finalize(() => {
                this.confirmDialogService.loading.set(false);
                this.confirmDialogService.setDialogDisableClose(false);
            })
        ).subscribe();
    }

    trackById(i: number, taskGroup: TaskGroup) {
        return taskGroup.id;
    }

    getLabel(taskGroup: TaskGroup) {
        let answeredTasks = this.testProcessService.taskGroupTasks()
            .find(t => t.taskGroupId === taskGroup.id)?.answeredTasksCount;
        let allTasks = taskGroup.tasks.length;
        const title = this.lang === 'uz' ? taskGroup.subject.titleUz : taskGroup.subject.titleRu;
        return title + ' ' + answeredTasks + '/' + allTasks;
    }

    get loading() {
        return this.testStateService.loading;
    }

    get testSession() {
        return this.testStateService.testSession;
    }

    get timeLeft() {
        return this.testProcessService.timeLeft;
    }

    get lang() {
        return this.translate.currentLang;
    }

    get progress() {
        return this.testProcessService.answeredTasksCount() / this.testProcessService.allTasksCount() * 100;
    }
}
