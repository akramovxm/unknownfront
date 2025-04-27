import {Component, inject} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";
import {
    ButtonProgressSpinnerComponent
} from "@shared/components/button-progress-spinner/button-progress-spinner.component";
import {MatButton} from "@angular/material/button";
import {DialogElement} from "@models/dialog-element";
import {TestStateService} from "@features/profile/test/services/test-state.service";

@Component({
    selector: 'app-test-start-dialog',
    imports: [
        MatDialogContent,
        MatDialogTitle,
        TranslatePipe,
        MatDialogActions,
        ButtonProgressSpinnerComponent,
        MatButton,
        MatDialogClose
    ],
    templateUrl: './test-start-dialog.component.html',
    styleUrl: './test-start-dialog.component.scss'
})
export class TestStartDialogComponent {
    private readonly testStateService = inject(TestStateService);

    dialogData: { subjectTitle: string, onConfirm: () => void } = inject(MAT_DIALOG_DATA);

    get loading() {
        return this.testStateService.loading();
    }
}
