import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-settings-toolbar',
  imports: [
    TranslatePipe
  ],
  templateUrl: './settings-toolbar.component.html',
  styleUrl: './settings-toolbar.component.scss'
})
export class SettingsToolbarComponent {

}
