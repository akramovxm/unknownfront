import {Component, inject} from '@angular/core';
import {BreakpointObserverService} from "@services/breakpoint-observer.service";

@Component({
    selector: 'app-container',
    imports: [],
    templateUrl: './container.component.html',
    styleUrl: './container.component.scss'
})
export class ContainerComponent {
    breakpointObserverService = inject(BreakpointObserverService);
}
