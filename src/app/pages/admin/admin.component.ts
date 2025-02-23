import {Component, inject} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "@services/auth.service";
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {MatTooltip} from "@angular/material/tooltip";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatListItem, MatNavList} from "@angular/material/list";
import {NgForOf} from "@angular/common";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {LanguageMenuComponent} from "@components/language-menu/language-menu.component";

@Component({
    selector: 'app-admin',
    imports: [
        MatToolbar,
        MatAnchor,
        MatIcon,
        RouterLink,
        MatButton,
        MatIconButton,
        MatTooltip,
        MatSidenavContainer,
        MatNavList,
        MatListItem,
        MatSidenav,
        MatSidenavContent,
        NgForOf,
        RouterOutlet,
        TranslatePipe,
        LanguageMenuComponent
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.css'
})
export class AdminComponent {
    router = inject(Router);
    authService = inject(AuthService);
    confirmDialogService = inject(ConfirmDialogService);
    breakpointObserverService = inject(BreakpointObserverService);
    translate = inject(TranslateService);

    navList = [
        {
            title: this.translate.instant('DASHBOARD'),
            path: '/admin'
        },
        {
            title: this.translate.instant('USERS'),
            path: '/admin/users'
        }
    ];

    get max425() {
        return this.breakpointObserverService.max425;
    }

    getActivated(path: string) {
        return path === this.router.url.split('?')[0];
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
}
