import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {HelpDialogComponent} from "@features/admin/tasks/components/help-dialog/help-dialog.component";

@Component({
    selector: 'app-task-create-toolbar',
    imports: [
        TranslatePipe,
        MatButton,
        MatIcon
    ],
    templateUrl: './task-create-toolbar.component.html',
    styleUrl: './task-create-toolbar.component.scss'
})
export class TaskCreateToolbarComponent {
    private readonly dialog = inject(MatDialog);

    onHelpClick() {
        this.dialog.open(HelpDialogComponent, { minWidth: '90vw', autoFocus: false });
    }
}
