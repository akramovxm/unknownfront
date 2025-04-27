import {Component, inject} from '@angular/core';
import {ContainerComponent} from "@shared/components/container/container.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {DatePipe, NgForOf} from "@angular/common";
import {MathjaxService} from "@services/mathjax.service";
import {TaskSelectionService} from "@features/admin/tasks/services/task-selection.service";
import {AdminTask} from "@features/admin/tasks/models/admin-task";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {TaskPreviewCardComponent} from "@features/admin/tasks/components/task-preview-card/task-preview-card.component";
import {MatList, MatListItem, MatListItemTitle} from "@angular/material/list";
import {SimpleToolbarComponent} from "@shared/components/simple-toolbar/simple-toolbar.component";
import {
    TaskDetailsActionsComponent
} from "@features/admin/tasks/components/task-details-actions/task-details-actions.component";

@Component({
    selector: 'app-task-details',
    imports: [
        ContainerComponent,
        MatTab,
        MatTabGroup,
        NgForOf,
        TaskPreviewCardComponent,
        MatList,
        MatListItem,
        MatListItemTitle,
        TranslatePipe,
        DatePipe,
        SimpleToolbarComponent,
        TaskDetailsActionsComponent
    ],
    templateUrl: './task-details.component.html',
    styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent {
    private readonly mathjaxService = inject(MathjaxService);
    private readonly taskSelectionService = inject(TaskSelectionService);
    private readonly translate = inject(TranslateService);

    trackByTask(index: number, task: AdminTask) {
        return task.id;
    }

    onIndexChange(i: number) {
        this.mathjaxService.renderMath();
    }

    getCardContent(task: AdminTask) {
        return this.translate.currentLang === 'ru' ? task.contentRu : task.contentUz;
    }
    getCreatedBy(task: AdminTask) {
        return task.createdBy ? task.createdBy?.firstName + ' ' + task.createdBy?.lastName : '-';
    }
    getUpdatedBy(task: AdminTask) {
        return task.updatedBy ? task.updatedBy?.firstName + ' ' + task.updatedBy?.lastName : '-';
    }
    get tasks() {
        return this.taskSelectionService.getFromLocalStorage();
    }
    get lang() {
        return this.translate.currentLang;
    }
}
