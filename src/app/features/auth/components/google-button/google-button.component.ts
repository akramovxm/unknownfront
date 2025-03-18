import {Component, input} from '@angular/core';
import {GOOGLE_AUTH_URL} from "../../../../app.constants";
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
}
