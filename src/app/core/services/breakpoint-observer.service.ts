import {inject, Injectable, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";

@Injectable({
    providedIn: 'root'
})
export class BreakpointObserverService implements OnDestroy {
    breakpointObserver = inject(BreakpointObserver);

    destroyed = new Subject<void>();

    max320 = false;
    max375 = false;
    max425 = false;
    max768 = false;
    max1024 = false;
    max1440 = false;
    max2560 = false;

    get containerWidth() {
        let width = "95%";
        if (this.max425) {
            width = "95%";
        } else if (this.max1440) {
            width = "85%";
        } else if (this.max2560) {
            width = "75%";
        }
        return width;
    }

    get titleClass() {
        return this.max375 ? "mat-headline-3" : "mat-headline-2"
    }

    constructor() {
        this.breakpointObserver
            .observe([
                "(max-width: 320px)",
                "(max-width: 375px)",
                "(max-width: 425px)",
                "(max-width: 768px)",
                "(max-width: 1024px)",
                "(max-width: 1440px)",
                "(max-width: 2560px)"
            ])
            .pipe(takeUntil(this.destroyed))
            .subscribe(result => {
                this.max320 = result.breakpoints["(max-width: 320px)"];
                this.max375 = result.breakpoints["(max-width: 375px)"];
                this.max425 = result.breakpoints["(max-width: 425px)"];
                this.max768 = result.breakpoints["(max-width: 768px)"];
                this.max1024 = result.breakpoints["(max-width: 1024px)"];
                this.max1440 = result.breakpoints["(max-width: 1440px)"];
                this.max2560 = result.breakpoints["(max-width: 2560px)"];
            });
    }

    ngOnDestroy() {
        this.destroyed.next();
        this.destroyed.complete();
    }
}
