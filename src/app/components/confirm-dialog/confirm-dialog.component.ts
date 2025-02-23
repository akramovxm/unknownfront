import {Component, inject} from '@angular/core';
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatList, MatListItem, MatListItemIcon, MatListItemLine, MatListItemTitle} from "@angular/material/list";
import {NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {DialogElement} from "@entities/dialog-element";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'app-confirm-dialog',
    imports: [
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatProgressSpinner,
        MatDialogTitle,
        MatList,
        MatListItem,
        NgForOf,
        MatIcon,
        MatListItemIcon,
        MatListItemTitle,
        MatListItemLine,
        TranslatePipe
    ],
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
    confirmDialogService = inject(ConfirmDialogService);

    get loading() {
        return this.confirmDialogService.loading;
    }

    dialogData: {
        title: string,
        message: string,
        onConfirm: () => void,
        loading: boolean,
        elements: DialogElement[]
    } = inject(MAT_DIALOG_DATA);
}
