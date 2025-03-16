import {inject, Injectable, signal} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "@components/confirm-dialog/confirm-dialog.component";
import {DialogElement} from "@models/dialog-element";

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {
    dialog = inject(MatDialog);
    dialogRef: MatDialogRef<ConfirmDialogComponent> | undefined;

    loading = signal(false);

    open(title: string, message: string, onConfirm: () => void, elements?: DialogElement[]) {
        this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
            autoFocus: false,
            data: { title, message, onConfirm, elements }
        });
    }

    setDialogDisableClose(value: boolean) {
        if (this.dialogRef) {
            this.dialogRef.disableClose = value;
        }
    }
}
