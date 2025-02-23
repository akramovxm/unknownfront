import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    router = inject(Router);
    translate = inject(TranslateService);

    constructor() {
        const savedLang = localStorage.getItem('lang') || 'en';
        this.translate.setDefaultLang(savedLang);
        this.translate.use(savedLang);
    }
}
