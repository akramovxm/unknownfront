import {Component, inject, OnInit, viewChild} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";
import {AdminUser} from "@features/admin/users/models/admin-user";
import {MatIcon} from "@angular/material/icon";
import {DatePipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {ReactiveFormsModule} from "@angular/forms";
import {UserSelectionService} from "@features/admin/users/services/user-selection.service";
import {Role} from "@models/role";
import {TranslatePipe} from "@ngx-translate/core";
import {ContainerComponent} from "@shared/components/container/container.component";
import {SearchInputComponent} from "@shared/components/search-input/search-input.component";
import {UserStateService} from "@features/admin/users/services/user-state.service";
import {switchMap, tap} from "rxjs";
import {ProgressBarComponent} from "@shared/components/progress-bar/progress-bar.component";
import {AuthStateService} from "@features/auth/services/auth-state.service";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@Component({
    selector: 'app-users-main',
    imports: [
        MatTableModule,
        MatCheckbox,
        MatIcon,
        DatePipe,
        NgIf,
        MatSortHeader,
        MatSort,
        MatPaginator,
        NgxTrimDirectiveModule,
        ReactiveFormsModule,
        TranslatePipe,
        ContainerComponent,
        NgStyle,
        SearchInputComponent,
        ProgressBarComponent,
        MatIconButton,
        MatTooltip,
        MatButton,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        NgForOf,
    ],
    templateUrl: './users-main.component.html',
    styleUrl: './users-main.component.scss'
})
export class UsersMainComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly authStateService = inject(AuthStateService);
    private readonly userSelectionService = inject(UserSelectionService);
    private readonly userStateService = inject(UserStateService);

    private readonly sort = viewChild(MatSort);

    readonly displayedColumns: string[] = ['select', 'locked', 'id', 'firstName', 'lastName', 'email', 'enabled',
        'phoneNumber', 'birthDate', 'role', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];

    ngOnInit() {
        this.activatedRoute.queryParams.pipe(
            tap(params => this.userStateService.updateParams(params)),
            switchMap(() => this.userStateService.getAll())
        ).subscribe();
    }

    onSortChange() {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {
                sortBy: this.sort()?.active,
                sortType: this.sort()?.direction
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

    onLockedClick(user: AdminUser) {
        this.userStateService.updatePartially({locked: !user.locked}, user.id).subscribe(res => {
            this.userStateService.users.update(value => value.map(u => {
                if (u.id === user.id) u.locked = !u.locked;
                return u;
            }));
        });
    }

    onRoleClick(user: AdminUser, role: Role) {
        this.userStateService.updatePartially({role: role}, user.id).subscribe(res => {
            this.userStateService.users.update(value => value.map(u => {
                if (u.id === user.id) u.role = role;
                return u;
            }));
        })
    }

    getLockedColor(user: AdminUser) {
        if (this.loading || this.isCurrentUser(user)) {
            return 'var(--mat-sys-disabled)';
        }
        return user.locked ? 'var(--mat-sys-error)' : 'var(--mat-sys-primary)';
    }

    getEnabledColor(enabled: boolean) {
        return enabled ? 'var(--mat-sys-primary)' : 'var(--mat-sys-tertiary)';
    }

    getRoleIcon(role: Role) {
        switch (role) {
            case Role.SUPERADMIN:
                return 'security';
            case Role.ADMIN:
                return 'shield_person';
            default:
                return 'school';
        }
    }

    isCurrentUser(user: AdminUser) {
        return user.email === this.authStateService.getEmailFromToken();
    }

    isAllSelected(): boolean {
        const selected = this.userSelectionService.selection.selected;
        const users = this.userStateService.users().filter(u => !this.isCurrentUser(u));
        return users.length > 0 && selected.length === users.length;
    }

    toggleAllRows() {
        const users = this.userStateService.users();
        if (this.isAllSelected()) {
            this.userSelectionService.selection.clear();
        } else {
            this.userSelectionService.selection.select(...users.filter(u => !this.isCurrentUser(u)));
        }
    }

    checkboxLabel(row?: AdminUser): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.userSelectionService.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    get roles() {
        switch (this.authStateService.role()) {
            case Role.SUPERADMIN:
                return [Role.SUPERADMIN, Role.ADMIN, Role.PUPIL];
            case Role.ADMIN:
                return [Role.ADMIN, Role.PUPIL];
            default:
                return [];
        }
    }
    get loading() {
        return this.userStateService.loading();
    }
    get search() {
        return this.userStateService.search;
    }
    get users() {
        return this.userStateService.users();
    }
    get selection() {
        return this.userSelectionService.selection;
    }
    get sortActive() {
        return this.userStateService.sortActive();
    }
    get sortDirection() {
        return this.userStateService.sortDirection();
    }
    get totalElements() {
        return this.userStateService.totalElements();
    }
    get page() {
        return this.userStateService.page();
    }
    get size() {
        return this.userStateService.size();
    }
    get headerChecked() {
        return this.selection.hasValue() && this.isAllSelected();
    }
    get headerIndeterminate() {
        return this.selection.hasValue() && !this.isAllSelected();
    }
}
