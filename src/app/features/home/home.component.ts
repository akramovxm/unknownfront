import {Component, inject} from '@angular/core';
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {AuthService} from "@services/auth.service";
import {Role} from "../../core/models/role";
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {MatToolbar} from "@angular/material/toolbar";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {LanguageMenuComponent} from "@components/language-menu/language-menu.component";

@Component({
    selector: 'app-home',
    imports: [
        MatIcon,
        MatAnchor,
        RouterLink,
        MatButton,
        MatToolbar,
        TranslatePipe,
        LanguageMenuComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    authService = inject(AuthService);
    confirmDialogService = inject(ConfirmDialogService);
    breakpointObserverService = inject(BreakpointObserverService);
    translate = inject(TranslateService);

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

    protected readonly Role = Role;
}
