import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { PageLoadingService } from '@services/page-loading.service';

@Component({
    selector: 'app-root',
    imports: [MatProgressBar, NgIf, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    private readonly pageLoadingService = inject(PageLoadingService);
    private readonly translate = inject(TranslateService);

    constructor() {
        const savedLang = localStorage.getItem('lang') || 'ru';
        this.translate.setDefaultLang(savedLang);
        this.translate.use(savedLang);
    }

    get loading() {
        return this.pageLoadingService.loading();
    }
}
