import {Component, effect, inject, OnInit, viewChild} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {AuthStateService} from "@features/auth/services/auth-state.service";
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatListItem, MatListItemIcon, MatNavList} from "@angular/material/list";
import {NgForOf, NgIf} from "@angular/common";
import {LanguageMenuComponent} from "@shared/components/language-menu/language-menu.component";
import {TestStateService} from "@features/profile/test/services/test-state.service";
import {TestProcessService} from "@features/profile/test/services/test-process.service";
import {TestStatus} from "@features/profile/test/models/test-status";

@Component({
    selector: 'app-profile-layout',
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
        LanguageMenuComponent,
    ],
    templateUrl: './profile-layout.component.html',
    styleUrl: './profile-layout.component.scss'
})
export class ProfileLayoutComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly authStateService = inject(AuthStateService);
    private readonly confirmDialogService = inject(ConfirmDialogService);
    private readonly translate = inject(TranslateService);
    private readonly testStateService = inject(TestStateService);

    constructor(private readonly testProcessService: TestProcessService,) {
        effect(() => {
            if (this.testProcessService.timeLeft() === 0 &&
                this.testStateService.testSession()?.status === TestStatus.IN_PROCESS) {
                this.testStateService.timeout().subscribe();
            }
        });
    }

    ngOnInit() {
        if (!this.testStateService.testSession()) {
            this.testStateService.getTestCurrentUser().subscribe();
        }
    }

    readonly navList = [
        {
            title: 'DASHBOARD',
            path: '/profile',
            icon: 'dashboard'
        },
        {
            title: 'SUBJECTS',
            path: '/profile/subjects',
            icon: 'menu_book'
        },
        {
            title: 'MY_TESTS',
            path: '/profile/my-tests',
            icon: 'fact_check'
        },
        {
            title: 'SETTINGS',
            path: '/profile/settings',
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
