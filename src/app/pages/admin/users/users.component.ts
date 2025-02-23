import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";
import {SelectionModel} from "@angular/cdk/collections";
import {UserService} from "@services/user.service";
import {AdminUser} from "@entities/admin-user";
import {ErrorService} from "@services/error.service";
import {MatIcon} from "@angular/material/icon";
import {DatePipe, NgIf} from "@angular/common";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {UserSelectionService} from "@services/user-selection.service";
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {Role} from "@enums/role";
import {DialogElement} from "@entities/dialog-element";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatFormField, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {catchError, debounceTime, distinctUntilChanged, filter, of, switchMap} from "rxjs";
import {ListResponse} from "@responses/list-response";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-users',
    imports: [
        MatTableModule,
        MatCheckbox,
        MatIcon,
        DatePipe,
        MatProgressBar,
        NgIf,
        MatSortHeader,
        MatSort,
        MatPaginator,
        MatButton,
        NgxTrimDirectiveModule,
        ReactiveFormsModule,
        MatAnchor,
        RouterLink,
        MatFormField,
        MatInput,
        MatIconButton,
        MatSuffix,
        TranslatePipe,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);
    snackbar = inject(MatSnackBar);
    userService = inject(UserService);
    errorService = inject(ErrorService);
    breakpointObserverService = inject(BreakpointObserverService);
    userSelectionService = inject(UserSelectionService);
    confirmDialogService = inject(ConfirmDialogService);
    translate = inject(TranslateService);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    sortActive = 'createdAt';
    sortDirection: 'asc' | 'desc' = 'desc';
    totalElements = 0;
    page = 0;
    size = 10;

    displayedColumns: string[] = ['select', 'locked', 'id', 'firstName', 'lastName', 'email', 'enabled',
        'phoneNumber', 'birthDate', 'role', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
    dataSource = new MatTableDataSource<AdminUser>([]);
    selection = new SelectionModel<AdminUser>(true, []);

    search = new FormControl('');

    getDialogElements() {
        const elements: DialogElement[] = [];

        this.selection.selected.forEach(user => {
            elements.push({
                icon: user.role === Role.ADMIN ? 'shield_person' : 'school',
                title: user.firstName + ' ' + user.lastName,
                subTitle: user.email
            })
        });

        return elements;
    }

    onSearchClick(e: MouseEvent) {
        this.search.setValue('');
        e.stopPropagation();
    }

    onUpdateClick() {
        this.userSelectionService.set(this.selection.selected);
    }

    onDeleteClick() {
        const elements = this.getDialogElements();

        const ids = this.selection.selected.map(u => u.id);

        this.confirmDialogService.open(
            this.translate.instant('DELETE_USERS'),
            this.translate.instant('DELETE_USERS_CONFIRM'),
            () => {
                this.deleteUsers(ids);
            },
            elements
        )
    }

    onLockClick() {
        const elements = this.getDialogElements();

        const ids = this.selection.selected.map(u => u.id);

        this.confirmDialogService.open(
            this.translate.instant('LOCK_USERS'),
            this.translate.instant('LOCK_USERS_CONFIRM'),
            () => {
                this.lockUsers(ids);
            },
            elements
        )
    }

    onUnlockClick() {
        const elements = this.getDialogElements();

        const ids = this.selection.selected.map(u => u.id);

        this.confirmDialogService.open(
            this.translate.instant('UNLOCK_USERS'),
            this.translate.instant('UNLOCK_USERS_CONFIRM'),
            () => {
                this.unlockUsers(ids);
            },
            elements
        )
    }

    onSortChange() {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {
                sortBy: this.sort.active,
                sortType: this.sort.direction
            },
            queryParamsHandling: 'merge'
        });
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

    ngOnInit() {
        this.search.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            filter((value): value is string => value !== null)
        ).subscribe(value => {
            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: { search: value }
            });
        })
        this.activatedRoute.queryParams.pipe(
            switchMap(value => {
                this.selection.clear();
                this.sortActive = value['sortBy'] || 'createdAt';
                this.sortDirection = value['sortType'] || 'desc';
                this.page = value['page'];
                this.size = value['size'];

                const queryParams = this.generateQueryParams();
                this.userService.loading = true;
                return this.userService.getAll(queryParams);
            }),
            catchError(err => {
                this.userService.loading = false;
                this.errorService.onError(err);
                return of(null);
            }),
        ).subscribe(res => {
            if (res !== null) {
                this.onGetUsersSuccess(res);
            }
        })
    }

    onGetUsersSuccess(res: ListResponse<AdminUser[]>) {
        this.userService.loading = false;
        this.dataSource.data = res.data;
        this.totalElements = res.totalElements;
        this.page = res.page;
        this.size = res.size;
    }

    generateQueryParams() {
        return {
            page: this.page || 0,
            size: this.size || 10,
            sortBy: this.sortActive ? this.sortActive + '_sort' : 'createdAt_sort',
            sortType: this.sortDirection || 'desc',
            search: this.search.value || ""
        }
    }

    getUsers() {
        const queryParams = this.generateQueryParams();
        this.userService.loading = true;
        this.userService.getAll(queryParams).subscribe({
            next: res => {
                this.onGetUsersSuccess(res);
            },
            error: err => {
                this.userService.loading = false;
                this.errorService.onError(err);
            }
        })
    }

    deleteUsers(ids: number[]) {
        this.confirmDialogService.loading = true;
        if (this.confirmDialogService.dialogRef) {
            this.confirmDialogService.dialogRef.disableClose = true;
        }
        this.userService.delete({ ids }).subscribe({
            next: res => {
                this.selection.clear();
                this.confirmDialogService.loading = false;
                if (this.confirmDialogService.dialogRef) {
                    this.confirmDialogService.dialogRef.disableClose = false;
                    this.confirmDialogService.dialogRef.close();
                }
                this.translate.get(['DELETE_USERS_SUCCESS', 'CLOSE']).subscribe(messages => {
                    this.snackbar.open(messages['DELETE_USERS_SUCCESS'], messages['CLOSE'], {duration: 5000});
                })
                this.getUsers();
            },
            error: err => {
                this.confirmDialogService.loading = false;
                if (this.confirmDialogService.dialogRef) {
                    this.confirmDialogService.dialogRef.disableClose = false;
                }
                this.errorService.onError(err);
            }
        })
    }

    lockUsers(ids: number[]) {
        this.confirmDialogService.loading = true;
        if (this.confirmDialogService.dialogRef) {
            this.confirmDialogService.dialogRef.disableClose = true;
        }
        this.userService.lock({ ids }).subscribe({
            next: res => {
                this.selection.clear();
                this.confirmDialogService.loading = false;
                if (this.confirmDialogService.dialogRef) {
                    this.confirmDialogService.dialogRef.disableClose = false;
                    this.confirmDialogService.dialogRef.close();
                }
                this.translate.get(['LOCK_USERS_SUCCESS', 'CLOSE']).subscribe(messages => {
                    this.snackbar.open(messages['LOCK_USERS_SUCCESS'], messages['CLOSE'], {duration: 5000});
                })
                this.dataSource.data = this.dataSource.data.map(u => {
                    if (ids.includes(u.id)) {
                        return { ...u, locked: true };
                    }
                    return u;
                })
            },
            error: err => {
                this.confirmDialogService.loading = false;
                if (this.confirmDialogService.dialogRef) {
                    this.confirmDialogService.dialogRef.disableClose = false;
                }
                this.errorService.onError(err);
            }
        })
    }

    unlockUsers(ids: number[]) {
        this.confirmDialogService.loading = true;
        if (this.confirmDialogService.dialogRef) {
            this.confirmDialogService.dialogRef.disableClose = true;
        }
        this.userService.unlock({ ids }).subscribe({
            next: res => {
                this.selection.clear();
                this.confirmDialogService.loading = false;
                if (this.confirmDialogService.dialogRef) {
                    this.confirmDialogService.dialogRef.disableClose = false;
                    this.confirmDialogService.dialogRef.close();
                }
                this.translate.get(['UNLOCK_USERS_SUCCESS', 'CLOSE']).subscribe(messages => {
                    this.snackbar.open(messages['UNLOCK_USERS_SUCCESS'], messages['CLOSE'], {duration: 5000});
                })
                this.dataSource.data = this.dataSource.data.map(u => {
                    if (ids.includes(u.id)) {
                        return { ...u, locked: false };
                    }
                    return u;
                })
            },
            error: err => {
                this.confirmDialogService.loading = false;
                if (this.confirmDialogService.dialogRef) {
                    this.confirmDialogService.dialogRef.disableClose = false;
                }
                this.errorService.onError(err);
            }
        })
    }

    get titleClass() {
        return this.breakpointObserverService.max375 ? "mat-headline-3" : "mat-headline-2";
    }

    get loading() {
        return this.userService.loading;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.dataSource.data);
    }

    checkboxLabel(row?: AdminUser): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    protected readonly Role = Role;
}
