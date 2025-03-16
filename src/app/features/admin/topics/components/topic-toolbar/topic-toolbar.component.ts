import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-topic-toolbar',
    imports: [
        TranslatePipe
    ],
  templateUrl: './topic-toolbar.component.html',
  styleUrl: './topic-toolbar.component.scss'
})
export class TopicToolbarComponent {

}
