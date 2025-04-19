import {Component, inject} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatListItem, MatListItemIcon, MatNavList} from "@angular/material/list";
import {NgForOf, NgIf} from "@angular/common";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {LanguageMenuComponent} from "@shared/components/language-menu/language-menu.component";
import {AuthStateService} from "@features/auth/services/auth-state.service";

@Component({
    selector: 'app-admin-layout',
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
        MatListItemIcon,
        MatSidenav,
        MatSidenavContent,
        NgForOf,
        RouterOutlet,
        TranslatePipe,
        LanguageMenuComponent
    ],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
    private readonly router = inject(Router);
    private readonly authStateService = inject(AuthStateService);
    private readonly confirmDialogService = inject(ConfirmDialogService);
    private readonly translate = inject(TranslateService);

    readonly navList = [
        {
            title: 'DASHBOARD',
            path: '/admin',
            icon: 'dashboard'
        },
        {
            title: 'USERS',
            path: '/admin/users',
            icon: 'person'
        },
        {
            title: 'SUBJECTS',
            path: '/admin/subjects',
            icon: 'menu_book'
        },
        {
            title: 'SETTINGS',
            path: '/admin/settings',
            icon: 'settings'
        }
    ];

    getActivated(path: string) {
        return path === this.router.url.split('?')[0];
    }

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
}
