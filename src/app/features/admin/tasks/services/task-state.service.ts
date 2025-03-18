import {inject, Injectable, signal} from '@angular/core';
import {catchError, finalize, of, tap} from "rxjs";
import {AdminTask} from "@features/admin/tasks/models/admin-task";
import {TaskService} from "@features/admin/tasks/services/task.service";
import {ErrorService} from "@services/error.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ListResponse} from "@models/list-response";
import {Params} from "@angular/router";
import {TaskSelectionService} from "@features/admin/tasks/services/task-selection.service";
import {TaskForm} from "@features/admin/tasks/models/task-form";
import {SnackbarService} from "@services/snackbar.service";
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class TaskStateService {
    private readonly snackbarService = inject(SnackbarService);
    private readonly taskService = inject(TaskService);
    private readonly taskSelectionService = inject(TaskSelectionService);
    private readonly confirmDialogService = inject(ConfirmDialogService);
    private readonly errorService = inject(ErrorService);
    private readonly translate = inject(TranslateService);

    readonly search = new FormControl('');

    readonly loading = signal<boolean>(false);
    readonly submitted = signal<boolean>(false);
    readonly totalElements = signal<number>(0);
    readonly page = signal<number>(0);
    readonly size = signal<number>(10);

    readonly tasks = signal<AdminTask[]>([]);

    getTasks() {
        const queryParams = this.generateQueryParams();
        this.loading.set(true);
        return this.taskService.getAll(queryParams).pipe(
            tap(res => this.onSuccess(res)),
            catchError(err => {
                this.errorService.onError(err);
                return of(null);
            }),
            finalize(() => this.loading.set(false))
        );
    }

    createTask(form: FormGroup<TaskForm>) {
        this.submitted.set(true);
        if (form.invalid) return;

        this.loading.set(true);
        form.disable();
        this.taskService.create(form.value).subscribe({
            next: res => {
                this.loading.set(false);
                form.enable();
                this.submitted.set(false);
                this.snackbarService.open('TASK_CREATED_SUCCESS');
            },
            error: err => {
                this.loading.set(false);
                form.enable();
                this.errorService.onError(err, form, ['exists']);
            }
        })
    }

    updateTask(form: FormGroup<TaskForm>, id: number) {
        this.submitted.set(true);
        if (form.invalid) return;

        this.loading.set(true);
        form.disable();

        this.taskService.update(form.value, id).subscribe({
            next: res => {
                this.loading.set(false);
                form.enable();
                this.submitted.set(false);
                this.snackbarService.open('TASK_UPDATED_SUCCESS');
                this.taskSelectionService.updateLocalStorage(res.data);
            },
            error: err => {
                this.loading.set(false);
                form.enable();
                this.errorService.onError(err, form, ['exists']);
            }
        })
    }

    deleteTasks() {
        const ids = this.taskSelectionService.selection.selected.map(t => t.id);

        this.confirmDialogService.open(
            this.translate.instant('DELETE_TASKS'),
            this.translate.instant('DELETE_TASKS_CONFIRM'),
            () => {
                this.confirmDialogService.loading.set(true);
                this.confirmDialogService.setDialogDisableClose(true);

                this.taskService.delete({ids}).pipe(
                    tap(res => {
                        this.taskSelectionService.selection.clear();
                        if (this.confirmDialogService.dialogRef) {
                            this.confirmDialogService.dialogRef.close();
                        }
                        this.getTasks().subscribe();
                        this.snackbarService.open('DELETE_TASKS_SUCCESS');
                    }),
                    finalize(() => {
                        this.confirmDialogService.loading.set(false);
                        this.confirmDialogService.setDialogDisableClose(false);
                    }),
                    catchError(err => {
                        this.errorService.onError(err)
                        return of(null);
                    })
                ).subscribe();
            }
        )
    }

    updateParams(params: Params) {
        this.taskSelectionService.selection.clear();
        if (params['search']) {
            this.search.setValue(params['search'] || '');
        }
        this.page.set(+params['page'] || 0);
        this.size.set(+params['size'] || 10);
    }

    private generateQueryParams() {
        return {
            page: this.page() || 0,
            size: this.size() || 10,
            search: this.search.value || ""
        }
    }

    private onSuccess(res: ListResponse<AdminTask[]>) {
        this.tasks.set(res.data);
        this.totalElements.set(res.totalElements);
        this.page.set(res.page);
        this.size.set(res.size);
    }
}
