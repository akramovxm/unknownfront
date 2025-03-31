import {Component, inject} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {MatAnchor, MatButton, MatIconAnchor, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {HelpDialogComponent} from "@features/admin/tasks/components/help-dialog/help-dialog.component";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-task-update-toolbar',
    imports: [
        TranslatePipe,
        MatButton,
        MatIcon,
        MatIconButton,
        MatTooltip,
        MatIconAnchor,
        RouterLink,
        MatAnchor
    ],
    templateUrl: './task-update-toolbar.component.html',
    styleUrl: './task-update-toolbar.component.scss'
})
export class TaskUpdateToolbarComponent {
    readonly boService = inject(BreakpointObserverService);
    private readonly dialog = inject(MatDialog);

    onHelpClick() {
        this.dialog.open(HelpDialogComponent, { minWidth: '90vw', autoFocus: false });
    }
}
