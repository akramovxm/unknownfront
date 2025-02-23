import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor, MatIconAnchor} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {GoogleButtonComponent} from "@components/google-button/google-button.component";
import {MatTooltip} from "@angular/material/tooltip";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {TranslatePipe} from "@ngx-translate/core";
import {LanguageMenuComponent} from "@components/language-menu/language-menu.component";

@Component({
    selector: 'app-auth-layout',
    imports: [
        RouterOutlet,
        MatToolbar,
        MatAnchor,
        MatIcon,
        RouterLink,
        GoogleButtonComponent,
        MatIconAnchor,
        MatTooltip,
        TranslatePipe,
        LanguageMenuComponent
    ],
    templateUrl: './auth-layout.component.html',
    styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
    router = inject(Router);
    breakpointObserverService = inject(BreakpointObserverService);

    get max320() {
        return this.breakpointObserverService.max320;
    }

    get isLoginPage() {
        return this.router.url === '/login';
    }

    get isRegPage() {
        return this.router.url === '/registration';
    }
}
