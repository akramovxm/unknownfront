import {inject, Injectable, signal} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PageLoadingService {
    private readonly router = inject(Router);

    readonly loading = signal<boolean>(false);

    constructor() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.loading.set(true);
            } else if (
                event instanceof NavigationEnd ||
                event instanceof NavigationCancel ||
                event instanceof NavigationError
            ) {
                this.loading.set(false);
            }
        });
    }
}