import {Component, inject, OnDestroy} from '@angular/core';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {NgForOf} from "@angular/common";
import {UpdateUserFormComponent} from "@components/update-user-form/update-user-form.component";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {UserSelectionService} from "@services/user-selection.service";

@Component({
    selector: 'app-update',
    imports: [
        MatTabGroup,
        MatTab,
        NgForOf,
        UpdateUserFormComponent,
    ],
    templateUrl: './update.component.html',
    styleUrl: './update.component.css'
})
export class UpdateComponent implements OnDestroy {
    userSelectionService = inject(UserSelectionService);
    breakpointObserverService = inject(BreakpointObserverService);

    get users() {
        return this.userSelectionService.users;
    }

    ngOnDestroy() {
        this.userSelectionService.remove();
    }
}
