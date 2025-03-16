import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-task-update-toolbar',
    imports: [
        TranslatePipe
    ],
  templateUrl: './task-update-toolbar.component.html',
  styleUrl: './task-update-toolbar.component.scss'
})
export class TaskUpdateToolbarComponent {

}
