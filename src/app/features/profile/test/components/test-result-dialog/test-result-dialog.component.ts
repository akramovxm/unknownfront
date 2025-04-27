import {Component, inject} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from "@angular/material/dialog";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {TestSession} from "@features/profile/test/models/test-session";
import {DatePipe, NgForOf} from "@angular/common";
import {TaskGroup} from "@features/profile/test/models/task-group";
import {MatAnchor} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'app-test-result-dialog',
    imports: [
        MatDialogContent,
        MatDialogTitle,
        TranslatePipe,
        DatePipe,
        NgForOf,
        MatAnchor,
        RouterLink,
        MatIcon,
        MatDialogActions,
        MatDialogClose
    ],
    templateUrl: './test-result-dialog.component.html',
    styleUrl: './test-result-dialog.component.scss'
})
export class TestResultDialogComponent {
    private readonly translate = inject(TranslateService);

    dialogData: { testSession: TestSession } = inject(MAT_DIALOG_DATA);

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
        let finish = new Date(this.dialogData.testSession.finishTime).getTime();
        let start = new Date(this.dialogData.testSession.startTime).getTime();
        const value = Math.max(Math.floor((finish - start) / 1000), 0);
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        const seconds = value % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}
