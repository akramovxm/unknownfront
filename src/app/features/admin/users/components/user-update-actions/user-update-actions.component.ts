import {Component, inject} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {BreakpointObserverService} from "@services/breakpoint-observer.service";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatIconAnchor} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
    selector: 'app-user-update-actions',
    imports: [
        TranslatePipe,
        MatIcon,
        MatIconAnchor,
        RouterLink,
        MatTooltip,
        MatAnchor
    ],
    templateUrl: './user-update-actions.component.html',
    styleUrl: './user-update-actions.component.scss'
})
export class UserUpdateActionsComponent {
    readonly boService = inject(BreakpointObserverService);
}
