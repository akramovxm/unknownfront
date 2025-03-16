import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-task-create-toolbar',
    imports: [
        TranslatePipe
    ],
  templateUrl: './task-create-toolbar.component.html',
  styleUrl: './task-create-toolbar.component.scss'
})
export class TaskCreateToolbarComponent {

}
