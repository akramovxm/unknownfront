import {Component, inject, signal} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {MatAnchor, MatButton, MatIconAnchor, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatTooltip} from "@angular/material/tooltip";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {TaskSelectionService} from "@features/admin/tasks/services/task-selection.service";
import {TaskStateService} from "@features/admin/tasks/services/task-state.service";

@Component({
    selector: 'app-tasks-actions',
    imports: [
        TranslatePipe,
        MatAnchor,
        MatButton,
        MatIcon,
        MatIconAnchor,
        MatIconButton,
        RouterLink,
        MatTooltip,
    ],
    templateUrl: './tasks-actions.component.html',
    styleUrl: './tasks-actions.component.scss'
})
export class TasksActionsComponent {
    readonly boService = inject(BreakpointObserverService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly taskStateService = inject(TaskStateService);
    private readonly taskSelectionService = inject(TaskSelectionService);

    readonly allSelected = signal<boolean>(false);

    saveToLocalStorage() {
        this.taskSelectionService.saveToLocalStorage();
    }

    onDeleteClick() {
        const subjectId = Number(this.activatedRoute.snapshot.paramMap.get('subjectId'));
        this.taskStateService.deleteTasks(subjectId);
    }

    onAllCheckClick() {
        if (this.allSelected()) {
            this.allSelected.set(false);
            this.taskSelectionService.selection.clear();
        } else {
            this.allSelected.set(true);
            this.taskSelectionService.selection.select(...this.taskStateService.tasks());
        }
    }

    get loading() {
        return this.taskStateService.loading();
    }
    get disabled() {
        return this.taskStateService.loading() || this.taskSelectionService.selection.selected.length === 0
    }
    get checkButtonTitle() {
        return this.allSelected() ? 'UNSELECT_ALL' : 'SELECT_ALL';
    }
    get checkButtonIcon() {
        return this.allSelected() ? 'check_box' : 'check_box_outline_blank';
    }
}
