import {Component, inject, signal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ButtonProgressSpinnerComponent} from "@shared/components/button-progress-spinner/button-progress-spinner.component";

@Component({
    selector: 'app-language-menu',
    imports: [
        MatButton,
        MatMenu,
        MatMenuItem,
        TranslatePipe,
        MatMenuTrigger,
        ButtonProgressSpinnerComponent
    ],
    templateUrl: './language-menu.component.html',
    styleUrl: './language-menu.component.scss'
})
export class LanguageMenuComponent {
    private readonly translate = inject(TranslateService);

    readonly loading = signal<boolean>(false);

    setLanguage(lang: string) {
        this.loading.set(true);

        this.translate.use(lang).subscribe(res => {
            this.loading.set(false);
        });
        
        localStorage.setItem('lang', lang);
    }

    get currentLang() {
        return this.translate.currentLang;
    }
}
