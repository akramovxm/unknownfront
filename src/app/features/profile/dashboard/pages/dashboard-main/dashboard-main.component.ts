import {Component, inject} from '@angular/core';
import {SimpleToolbarComponent} from "@shared/components/simple-toolbar/simple-toolbar.component";
import {TranslatePipe} from "@ngx-translate/core";
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {TestStateService} from "@features/profile/test/services/test-state.service";
import {
    TestStartFormDialogComponent
} from "@features/profile/test/components/test-start-form-dialog/test-start-form-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-dashboard-main',
    imports: [
        SimpleToolbarComponent,
        TranslatePipe,
        MatAnchor,
        MatButton,
        MatIcon,
        NgIf,
        RouterLink
    ],
    templateUrl: './dashboard-main.component.html',
    styleUrl: './dashboard-main.component.scss'
})
export class DashboardMainComponent {
    private readonly dialog = inject(MatDialog);
    readonly testStateService = inject(TestStateService);

    onStartClick() {
        this.dialog.open(TestStartFormDialogComponent, {autoFocus: false, width: '480px'});
    }
}
