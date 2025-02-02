import {Component} from '@angular/core';
import {FACEBOOK_AUTH_URL} from "../../app.constants";

@Component({
    selector: 'app-facebook-button',
    standalone: true,
    imports: [],
    templateUrl: './facebook-button.component.html',
    styleUrl: './facebook-button.component.css'
})
export class FacebookButtonComponent {
    facebookAuthUrl = FACEBOOK_AUTH_URL;
}
