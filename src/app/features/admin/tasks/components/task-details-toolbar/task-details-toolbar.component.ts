import {Component, inject} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatIconAnchor} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
    selector: 'app-task-details-toolbar',
    imports: [
        TranslatePipe,
        MatIcon,
        MatIconAnchor,
        RouterLink,
        MatTooltip,
        MatAnchor
    ],
    templateUrl: './task-details-toolbar.component.html',
    styleUrl: './task-details-toolbar.component.scss'
})
export class TaskDetailsToolbarComponent {
    readonly boService = inject(BreakpointObserverService);


}
