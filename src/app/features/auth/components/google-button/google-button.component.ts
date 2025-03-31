import {Component, input, signal} from '@angular/core';
import {GOOGLE_AUTH_URL} from "@constants";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'app-google-button',
    standalone: true,
    imports: [
        TranslatePipe
    ],
    templateUrl: './google-button.component.html',
    styleUrl: './google-button.component.scss'
})
export class GoogleButtonComponent {
    googleAuthUrl = GOOGLE_AUTH_URL;

    readonly disabled = input.required<boolean>();
    readonly clicked = signal<boolean>(false);

    onClick() {
        this.clicked.set(true);
    }
}
