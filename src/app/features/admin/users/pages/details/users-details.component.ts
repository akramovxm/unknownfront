import {Component, inject} from '@angular/core';
import {ContainerComponent} from "@shared/components/container/container.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {DatePipe, NgForOf} from "@angular/common";
import {UserSelectionService} from "@features/admin/users/services/user-selection.service";
import {AdminUser} from "@features/admin/users/models/admin-user";
import {TranslatePipe} from "@ngx-translate/core";
import {MatList, MatListItem, MatListItemTitle} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {Role} from "@models/role";
import {SimpleToolbarComponent} from "@shared/components/simple-toolbar/simple-toolbar.component";

@Component({
    selector: 'app-users-details',
    imports: [
        ContainerComponent,
        MatTab,
        MatTabGroup,
        NgForOf,
        TranslatePipe,
        MatList,
        MatListItem,
        MatListItemTitle,
        DatePipe,
        MatIcon,
        SimpleToolbarComponent,
    ],
    templateUrl: './users-details.component.html',
    styleUrl: './users-details.component.scss'
})
export class UsersDetailsComponent {
    private readonly userSelectionService = inject(UserSelectionService);

    trackById(index: number, user: AdminUser) {
        return user.id;
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

    getCreatedBy(user: AdminUser) {
        return user.createdBy ? user.createdBy?.firstName + ' ' + user.createdBy?.lastName : '-';
    }
    getUpdatedBy(user: AdminUser) {
        return user.updatedBy ? user.updatedBy?.firstName + ' ' + user.updatedBy?.lastName : '-';
    }

    get users(): AdminUser[] {
        return this.userSelectionService.getFromLocalStorage();
    }
}
