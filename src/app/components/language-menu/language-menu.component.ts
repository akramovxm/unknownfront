import {Component, inject} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";

@Component({
    selector: 'app-language-menu',
    imports: [
        MatButton,
        MatIcon,
        MatIconButton,
        MatMenu,
        MatMenuItem,
        TranslatePipe,
        MatMenuTrigger
    ],
    templateUrl: './language-menu.component.html',
    styleUrl: './language-menu.component.css'
})
export class LanguageMenuComponent {
    translate = inject(TranslateService);
    breakpointObserverService = inject(BreakpointObserverService);

    setLanguage(lang: string) {
        this.translate.use(lang);
        localStorage.setItem('lang', lang);
    }

    get max425() {
        return this.breakpointObserverService.max425;
    }
}
