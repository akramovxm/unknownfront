import {Component, input} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {MatToolbar} from "@angular/material/toolbar";
import {ContainerComponent} from "@shared/components/container/container.component";

@Component({
  selector: 'app-simple-toolbar',
    imports: [
        TranslatePipe,
        MatToolbar,
        ContainerComponent
    ],
  templateUrl: './simple-toolbar.component.html',
  styleUrl: './simple-toolbar.component.scss'
})
export class SimpleToolbarComponent {
    readonly title = input.required<string>();
}
