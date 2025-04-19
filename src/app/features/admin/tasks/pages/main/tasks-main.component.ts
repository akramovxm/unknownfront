import {Component, inject, OnInit} from '@angular/core';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {AdminTask} from "@features/admin/tasks/models/admin-task";
import {TaskAdminCardComponent} from "@features/admin/tasks/components/task-admin-card/task-admin-card.component";
import {NgForOf, NgIf} from "@angular/common";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {ContainerComponent} from "@shared/components/container/container.component";
import {SearchInputComponent} from "@shared/components/search-input/search-input.component";
import {ProgressBarComponent} from "@shared/components/progress-bar/progress-bar.component";
import {TaskSelectionService} from "@features/admin/tasks/services/task-selection.service";
import {TaskStateService} from "@features/admin/tasks/services/task-state.service";
import {switchMap, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {SimpleToolbarComponent} from "@shared/components/simple-toolbar/simple-toolbar.component";
import {TasksActionsComponent} from "@features/admin/tasks/components/tasks-actions/tasks-actions.component";

@Component({
    selector: 'app-tasks-main',
    imports: [
        TaskAdminCardComponent,
        NgForOf,
        NgxTrimDirectiveModule,
        ContainerComponent,
        SearchInputComponent,
        ProgressBarComponent,
        MatPaginator,
        NgIf,
        TranslatePipe,
        SimpleToolbarComponent,
        TasksActionsComponent
    ],
    templateUrl: './tasks-main.component.html',
    styleUrl: './tasks-main.component.scss'
})
export class TasksMainComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly taskStateService = inject(TaskStateService);
    private readonly taskSelectionService = inject(TaskSelectionService);
    private readonly translate = inject(TranslateService);

    ngOnInit() {
        const subjectId = Number(this.activatedRoute.snapshot.paramMap.get('subjectId'));

        this.taskSelectionService.selection.clear();

        this.activatedRoute.queryParams.pipe(
            tap(params => this.taskStateService.updateParams(params)),
            switchMap(() => this.taskStateService.getTasks(subjectId))
        ).subscribe();
    }

    onPageChange(e: PageEvent) {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {
                page: e.pageIndex,
                size: e.pageSize
            },
            queryParamsHandling: 'merge'
        });
    }

    onCheckClick(task: AdminTask) {
        this.taskSelectionService.selection.toggle(task);
    }

    getSelected(task: AdminTask) {
        return this.taskSelectionService.selection.isSelected(task);
    }

    get tasks() {
        return this.taskStateService.tasks();
    }
    get loading() {
        return this.taskStateService.loading();
    }
    get lang() {
        return this.translate.currentLang;
    }
    get search() {
        return this.taskStateService.search;
    }
    get totalElements() {
        return this.taskStateService.totalElements();
    }
    get page() {
        return this.taskStateService.page();
    }
    get size() {
        return this.taskStateService.size();
    }
}
