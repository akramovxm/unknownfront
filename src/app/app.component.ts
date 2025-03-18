import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { GlobalLoadingService } from '@services/global-loading.service';

@Component({
    selector: 'app-root',
    imports: [MatProgressBar, NgIf, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    private readonly globalLoadingService = inject(GlobalLoadingService);
    private readonly translate = inject(TranslateService);

    constructor() {
        const savedLang = localStorage.getItem('lang') || 'ru';
        this.translate.setDefaultLang(savedLang);
        this.translate.use(savedLang);
    }

    get loading() {
        return this.globalLoadingService.loading();
    }
}
