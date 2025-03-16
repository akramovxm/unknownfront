import {inject, Injectable, signal} from '@angular/core';
import {AdminUser} from "@features/admin/users/models/admin-user";
import {FormControl, FormGroup} from "@angular/forms";
import {ListResponse} from "@models/list-response";
import {UserService} from "@features/admin/users/services/user.service";
import {catchError, finalize, Observable, of, tap} from "rxjs";
import {Params} from "@angular/router";
import {UserSelectionService} from "@features/admin/users/services/user-selection.service";
import {ErrorService} from "@services/error.service";
import {UserForm} from "@features/admin/users/models/user-form";
import {UserRequest} from "@features/admin/users/models/user-request";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarService} from "@services/snackbar.service";
import {Response} from "@models/response";
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {DialogElement} from "@models/dialog-element";
import {Role} from "@models/role";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class UserStateService {
    private readonly snackbarService = inject(SnackbarService);
    private readonly userService = inject(UserService);
    private readonly userSelectionService = inject(UserSelectionService);
    private readonly confirmDialogService = inject(ConfirmDialogService);
    private readonly errorService = inject(ErrorService);
    private readonly translate = inject(TranslateService);

    readonly search = new FormControl('');

    readonly loading = signal<boolean>(false);
    readonly sortActive = signal<string>('createdAt');
    readonly sortDirection = signal<'asc' | 'desc'>('desc');
    readonly totalElements = signal<number>(0);
    readonly page = signal<number>(0);
    readonly size = signal<number>(10);

    readonly users = signal<AdminUser[]>([]);

    updateParams(params: Params) {
        this.userSelectionService.selection.clear();
        this.sortActive.set(params['sortBy'] || 'createdAt');
        this.sortDirection.set(params['sortType'] || 'desc');
        this.page.set(+params['page'] || 0);
        this.size.set(+params['size'] || 10);
    }

    getUsers() {
        const queryParams = this.generateQueryParams();
        this.loading.set(true);
        return this.userService.getAll(queryParams).pipe(
            tap(res => this.onGetUsersSuccess(res)),
            catchError(err => {
                this.errorService.onError(err);
                return of(null);
            }),
            finalize(() => this.loading.set(false))
        );
    }

    createUser(form: FormGroup<UserForm>) {
        if (form.invalid) return;

        this.loading.set(true);
        form.disable();

        this.userService.create(form.value as UserRequest)
            .subscribe({
                next: res => {
                    this.loading.set(false);
                    form.enable();
                    this.snackbarService.open('USER_CREATED_SUCCESS');
                },
                error: (err: HttpErrorResponse) => {
                    this.loading.set(false);
                    form.enable();
                    this.errorService.onError(err, form);
                }
            });
    }

    updateUser(form: FormGroup<UserForm>, id: number) {
        if (form.invalid) return;

        this.loading.set(true);
        form.disable();

        this.userService.update(form.value as UserRequest, id)
            .subscribe({
                next: res => {
                    this.loading.set(false);
                    form.enable();
                    this.snackbarService.open('USER_UPDATED_SUCCESS');
                    this.userSelectionService.updateLocalStorage(res.data);
                },
                error: (err: HttpErrorResponse) => {
                    this.loading.set(false);
                    form.enable();
                    this.errorService.onError(err);
                }
            });
    }

    deleteUsers() {
        const elements = this.getDialogElements();
        const ids = this.userSelectionService.selection.selected.map(u => u.id);

        this.confirmDialogService.open(
            this.translate.instant('DELETE_USERS'),
            this.translate.instant('DELETE_USERS_CONFIRM'),
            () => this.executeUserAction(
                ids,
                'DELETE_USERS_SUCCESS',
                () => this.userService.delete({ids}),
                () => this.getUsers().subscribe()
            ),
            elements
        )
    }

    lockUsers() {
        const elements = this.getDialogElements();
        const ids = this.userSelectionService.selection.selected.map(u => u.id);

        this.confirmDialogService.open(
            this.translate.instant('LOCK_USERS'),
            this.translate.instant('LOCK_USERS_CONFIRM'),
            () => this.executeUserAction(
                ids,
                'LOCK_USERS_SUCCESS',
                () => this.userService.lock({ids}),
                () => this.updateUsersLockState(ids, true)
            ),
            elements
        )
    }

    unlockUsers() {
        const elements = this.getDialogElements();
        const ids = this.userSelectionService.selection.selected.map(u => u.id);

        this.confirmDialogService.open(
            this.translate.instant('UNLOCK_USERS'),
            this.translate.instant('UNLOCK_USERS_CONFIRM'),
            () => this.executeUserAction(
                ids,
                'UNLOCK_USERS_SUCCESS',
                () => this.userService.unlock({ids}),
                () => this.updateUsersLockState(ids, false)
            ),
            elements
        )
    }

    private executeUserAction(
        ids: number[],
        successKey: string,
        actionFn: (ids: { ids: number[] }) => Observable<Response<null>>,
        updateFn?: () => void
    ) {
        this.confirmDialogService.loading.set(true);
        this.confirmDialogService.setDialogDisableClose(true);

        actionFn({ids}).pipe(
            tap(res => {
                this.userSelectionService.selection.clear();
                if (this.confirmDialogService.dialogRef) {
                    this.confirmDialogService.dialogRef.close();
                }
                updateFn?.();
                this.snackbarService.open(successKey);
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

    private generateQueryParams() {
        return {
            page: this.page() || 0,
            size: this.size() || 10,
            sortBy: this.sortActive() ? this.sortActive() + '_sort' : 'createdAt_sort',
            sortType: this.sortDirection() || 'desc',
            search: this.search.value || ""
        }
    }

    private onGetUsersSuccess(res: ListResponse<AdminUser[]>) {
        this.users.set(res.data);
        this.totalElements.set(res.totalElements);
        this.page.set(res.page);
        this.size.set(res.size);
    }

    private updateUsersLockState(ids: number[], locked: boolean) {
        this.users.update(users =>
            users.map(u => ids.includes(u.id) ? {...u, locked} : u)
        );
    }

    private getDialogElements() {
        const elements: DialogElement[] = [];

        this.userSelectionService.selection.selected.forEach(user => {
            elements.push({
                icon: user.role === Role.ADMIN ? 'shield_person' : 'school',
                title: user.firstName + ' ' + user.lastName,
                subTitle: user.email
            })
        });

        return elements;
    }
}
