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

@Component({
    selector: 'app-confirm-dialog',
    imports: [
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatProgressSpinner,
        MatDialogTitle
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
        loading: boolean
    } = inject(MAT_DIALOG_DATA);
}
