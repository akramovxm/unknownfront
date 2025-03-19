import {Component, inject, OnInit, viewChild} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";
import {AdminUser} from "@features/admin/users/models/admin-user";
import {MatIcon} from "@angular/material/icon";
import {DatePipe, NgIf, NgStyle} from "@angular/common";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {ReactiveFormsModule} from "@angular/forms";
import {UserSelectionService} from "@features/admin/users/services/user-selection.service";
import {Role} from "@models/role";
import {TranslatePipe} from "@ngx-translate/core";
import {ContainerComponent} from "@components/container/container.component";
import {SearchInputComponent} from "@components/search-input/search-input.component";
import {UserStateService} from "@features/admin/users/services/user-state.service";
import {switchMap, tap} from "rxjs";
import {ProgressBarComponent} from "@components/progress-bar/progress-bar.component";
import { AuthService } from '@services/auth.service';

@Component({
    selector: 'app-users',
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
    ],
    templateUrl: './get-all.component.html',
    styleUrl: './get-all.component.scss'
})
export class GetAllComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly authService = inject(AuthService);
    private readonly userSelectionService = inject(UserSelectionService);
    private readonly userStateService = inject(UserStateService);

    private readonly sort = viewChild(MatSort);

    readonly displayedColumns: string[] = ['select', 'locked', 'id', 'firstName', 'lastName', 'email', 'enabled',
        'phoneNumber', 'birthDate', 'role', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];

    ngOnInit() {
        this.activatedRoute.queryParams.pipe(
            tap(params => this.userStateService.updateParams(params)),
            switchMap(() => this.userStateService.getUsers())
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

    isCurrentUser(user: AdminUser) {
        return user.email === this.authService.getEmailFromToken();
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

    protected readonly Role = Role;
}
