import {Component, inject} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatButton, MatIconAnchor, MatIconButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {MatTooltip} from "@angular/material/tooltip";
import {UserSelectionService} from "@features/admin/users/services/user-selection.service";
import {UserStateService} from "@features/admin/users/services/user-state.service";

@Component({
    selector: 'app-users-toolbar',
    imports: [
        TranslatePipe,
        MatIcon,
        MatButton,
        MatAnchor,
        MatIconAnchor,
        MatIconButton,
        RouterLink,
        MatTooltip,
    ],
    templateUrl: './users-toolbar.component.html',
    styleUrl: './users-toolbar.component.scss'
})
export class UsersToolbarComponent {
    readonly boService = inject(BreakpointObserverService);
    private readonly userStateService = inject(UserStateService);
    private readonly userSelectionService = inject(UserSelectionService);

    onUpdateClick() {
        this.userSelectionService.saveToLocalStorage();
    }

    onDeleteClick() {
        this.userStateService.deleteUsers();
    }

    onLockClick() {
        this.userStateService.lockUsers();
    }

    onUnlockClick() {
        this.userStateService.unlockUsers();
    }

    get disabled() {
        return this.userStateService.loading() || this.userSelectionService.selection.selected.length === 0
    }
}
