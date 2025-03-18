import {Component, inject} from '@angular/core';
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {AuthService} from "@services/auth.service";
import {Role} from "@models/role";
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {MatToolbar} from "@angular/material/toolbar";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {LanguageMenuComponent} from "@components/language-menu/language-menu.component";
import {PageLoadingService} from "@services/page-loading.service";
import {ButtonProgressSpinnerComponent} from "@components/button-progress-spinner/button-progress-spinner.component";

@Component({
    selector: 'app-home',
    imports: [
        MatIcon,
        MatAnchor,
        RouterLink,
        MatButton,
        MatToolbar,
        TranslatePipe,
        LanguageMenuComponent,
        ButtonProgressSpinnerComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    private readonly authService = inject(AuthService);
    private readonly pageLoadingService = inject(PageLoadingService);
    private readonly confirmDialogService = inject(ConfirmDialogService);
    private readonly breakpointObserverService = inject(BreakpointObserverService);
    private readonly translate = inject(TranslateService);

    logout() {
        this.confirmDialogService.open(
            this.translate.instant('LOGOUT'),
            this.translate.instant('LOGOUT_CONFIRM'),
            () => {
                this.authService.logout();
                if (this.confirmDialogService.dialogRef) {
                    this.confirmDialogService.dialogRef.close();
                }
            }
        )
    }

    get loading() {
        return this.pageLoadingService.loading();
    }
    get titleClass() {
        return this.breakpointObserverService.max425 ? "mat-headline-2" : "mat-headline-1";
    }
    get subTitleClass() {
        return this.breakpointObserverService.max768 ? "mat-caption" : "mat-subtitle-1";
    }
    get auth() {
        return this.authService.auth;
    }
    get role() {
        return this.authService.role;
    }

    protected readonly Role = Role;
}
