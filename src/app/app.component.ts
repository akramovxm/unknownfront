import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatAnchor, MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatButton, MatAnchor, RouterLink, NgIf, MatTooltip],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    router = inject(Router);

    get isVerifyPage() {
        return this.router.url === '/verify';
    }

    get isUpdatePasswordPage() {
        return this.router.url === '/update-password';
    }

    get email() {
        return sessionStorage.getItem('email') ?? '';
    }

    get emailType() {
        return sessionStorage.getItem('emailType') ?? '';
    }
}
