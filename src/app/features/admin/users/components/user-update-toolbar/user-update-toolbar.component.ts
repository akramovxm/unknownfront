import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-user-update-toolbar',
    imports: [
        TranslatePipe
    ],
  templateUrl: './user-update-toolbar.component.html',
  styleUrl: './user-update-toolbar.component.scss'
})
export class UserUpdateToolbarComponent {

}
