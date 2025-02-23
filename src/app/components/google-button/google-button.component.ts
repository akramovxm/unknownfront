import {Component} from '@angular/core';
import {GOOGLE_AUTH_URL} from "../../app.constants";
import {MatTooltip} from "@angular/material/tooltip";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'app-google-button',
    standalone: true,
    imports: [
        MatTooltip,
        TranslatePipe
    ],
    templateUrl: './google-button.component.html',
    styleUrl: './google-button.component.css'
})
export class GoogleButtonComponent {
    googleAuthUrl = GOOGLE_AUTH_URL;
}
