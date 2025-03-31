import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {LanguageMenuComponent} from "@shared/components/language-menu/language-menu.component";

@Component({
    selector: 'app-auth-layout',
    imports: [
        RouterOutlet,
        MatToolbar,
        MatAnchor,
        MatIcon,
        RouterLink,
        TranslatePipe,
        LanguageMenuComponent,
    ],
    templateUrl: './auth-layout.component.html',
    styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
