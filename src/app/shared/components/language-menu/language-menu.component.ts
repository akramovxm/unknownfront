import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import { GlobalLoadingService } from '@services/global-loading.service';

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
    private readonly globalLoadingService = inject(GlobalLoadingService);
    private readonly translate = inject(TranslateService);

    setLanguage(lang: string) {
        this.globalLoadingService.loading.set(true);

        this.translate.use(lang).subscribe(res => {
            this.globalLoadingService.loading.set(false);
        });
        
        localStorage.setItem('lang', lang);
    }

    get currentLang() {
        return this.translate.currentLang;
    }
}
