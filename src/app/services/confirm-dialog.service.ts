import {inject, Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "@components/confirm-dialog/confirm-dialog.component";
import {DialogElement} from "@entities/dialog-element";

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {
    dialog = inject(MatDialog);
    dialogRef: MatDialogRef<ConfirmDialogComponent> | undefined;

    loading = false;

    open(title: string, message: string, onConfirm: () => void, elements?: DialogElement[]) {
        this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
            autoFocus: false,
            data: { title, message, onConfirm, elements }
        });
    }
}
