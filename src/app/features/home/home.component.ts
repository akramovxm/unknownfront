import {Component, inject} from '@angular/core';
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {MatToolbar} from "@angular/material/toolbar";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {LanguageMenuComponent} from "@shared/components/language-menu/language-menu.component";
import {PageLoadingService} from "@services/page-loading.service";
import {ButtonProgressSpinnerComponent} from "@shared/components/button-progress-spinner/button-progress-spinner.component";
import {AuthStateService} from "@features/auth/services/auth-state.service";

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
    private readonly router = inject(Router);
    private readonly authStateService = inject(AuthStateService);
    private readonly pageLoadingService = inject(PageLoadingService);
    private readonly confirmDialogService = inject(ConfirmDialogService);
    private readonly breakpointObserverService = inject(BreakpointObserverService);
    private readonly translate = inject(TranslateService);

    logout() {
        this.confirmDialogService.open(
            this.translate.instant('LOGOUT'),
            this.translate.instant('LOGOUT_CONFIRM'),
            () => {
                this.authStateService.logout();
                this.router.navigate(['/login']);
                if (this.confirmDialogService.dialogRef) {
                    this.confirmDialogService.dialogRef.close();
                }
            }
        )
    }

    get isAdmin() {
        return this.authStateService.isAdmin();
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
        return this.authStateService.auth();
    }
}
