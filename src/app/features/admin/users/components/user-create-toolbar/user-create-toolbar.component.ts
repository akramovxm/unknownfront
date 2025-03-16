import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'app-user-create-toolbar',
    imports: [
        TranslatePipe
    ],
    templateUrl: './user-create-toolbar.component.html',
    styleUrl: './user-create-toolbar.component.scss'
})
export class UserCreateToolbarComponent {

}
