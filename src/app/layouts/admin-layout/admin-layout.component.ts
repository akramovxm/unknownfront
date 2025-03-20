import {Component, inject} from '@angular/core';
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NavigationEnd, Router, RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "@services/auth.service";
import {ConfirmDialogService} from "@services/confirm-dialog.service";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatListItem, MatListItemIcon, MatNavList} from "@angular/material/list";
import {NgForOf, NgIf} from "@angular/common";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {LanguageMenuComponent} from "@components/language-menu/language-menu.component";
import {CdkPortalOutlet, ComponentPortal} from "@angular/cdk/portal";
import {filter} from "rxjs";
import {UsersToolbarComponent} from "@features/admin/users/components/users-toolbar/users-toolbar.component";
import {TasksToolbarComponent} from "@features/admin/tasks/components/tasks-toolbar/tasks-toolbar.component";
import {ContainerComponent} from "@components/container/container.component";
import {
    UserCreateToolbarComponent
} from "@features/admin/users/components/user-create-toolbar/user-create-toolbar.component";
import {
    UserUpdateToolbarComponent
} from "@features/admin/users/components/user-update-toolbar/user-update-toolbar.component";
import {
    TaskCreateToolbarComponent
} from "@features/admin/tasks/components/task-create-toolbar/task-create-toolbar.component";
import {
    TaskUpdateToolbarComponent
} from "@features/admin/tasks/components/task-update-toolbar/task-update-toolbar.component";
import {TopicToolbarComponent} from "@features/admin/topics/components/topic-toolbar/topic-toolbar.component";
import {SettingsToolbarComponent} from "@features/admin/settings/components/settings-toolbar/settings-toolbar.component";
import { UpdatePasswordToolbarComponent } from '@features/admin/settings/components/update-password-toolbar/update-password-toolbar.component';

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
        LanguageMenuComponent,
        MatToolbarRow,
        CdkPortalOutlet,
        NgIf,
        ContainerComponent
    ],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
    router = inject(Router);
    authService = inject(AuthService);
    confirmDialogService = inject(ConfirmDialogService);
    translate = inject(TranslateService);

    portal: ComponentPortal<any> | null = null;

    constructor() {
        this.router.events
            .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe((event) => {
                const url = event.urlAfterRedirects;
                this.setPortal(url);
            });
    }

    setPortal(url: string) {
        switch (url.split('?')[0]) {
            case '/admin/users':
                this.portal = new ComponentPortal(UsersToolbarComponent);
                break;
            case '/admin/users/create':
                this.portal = new ComponentPortal(UserCreateToolbarComponent);
                break;
            case '/admin/users/update':
                this.portal = new ComponentPortal(UserUpdateToolbarComponent);
                break;
            case '/admin/topics':
                this.portal = new ComponentPortal(TopicToolbarComponent);
                break;
            case '/admin/tasks':
                this.portal = new ComponentPortal(TasksToolbarComponent);
                break;
            case '/admin/tasks/create':
                this.portal = new ComponentPortal(TaskCreateToolbarComponent);
                break;
            case '/admin/tasks/update':
                this.portal = new ComponentPortal(TaskUpdateToolbarComponent);
                break;
            case '/admin/settings':
                this.portal = new ComponentPortal(SettingsToolbarComponent);
                break;
            case '/admin/settings/update-password':
                this.portal = new ComponentPortal(UpdatePasswordToolbarComponent);
                break;
            default:
                this.portal = null;

        }
    }

    navList = [
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
            title: 'TOPICS',
            path: '/admin/topics',
            icon: 'topic'
        },
        {
            title: 'TASKS',
            path: '/admin/tasks',
            icon: 'task'
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
                this.authService.logout();
                if (this.confirmDialogService.dialogRef) {
                    this.confirmDialogService.dialogRef.close();
                }
            }
        )
    }
}
