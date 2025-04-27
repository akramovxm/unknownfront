import { Component } from '@angular/core';
import {SimpleToolbarComponent} from "@shared/components/simple-toolbar/simple-toolbar.component";
import {TranslatePipe} from "@ngx-translate/core";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-dashboard-main',
    imports: [
        SimpleToolbarComponent,
        TranslatePipe,
        MatIcon,
        MatButton,
        MatAnchor,
        RouterLink
    ],
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss'
})
export class DashboardMainComponent {

}
