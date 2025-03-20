import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-update-password-toolbar',
  imports: [
    TranslatePipe
  ],
  templateUrl: './update-password-toolbar.component.html',
  styleUrl: './update-password-toolbar.component.scss'
})
export class UpdatePasswordToolbarComponent {

}
