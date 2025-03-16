import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-language-menu',
    imports: [
        MatButton,
        MatMenu,
        MatMenuItem,
        TranslatePipe,
        MatMenuTrigger
    ],
    templateUrl: './language-menu.component.html',
    styleUrl: './language-menu.component.scss'
})
export class LanguageMenuComponent {
    translate = inject(TranslateService);

    setLanguage(lang: string) {
        this.translate.use(lang);
        localStorage.setItem('lang', lang);
    }

    get currentLang() {
        return this.translate.currentLang;
    }
}
