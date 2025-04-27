import {inject, Injectable, signal} from '@angular/core';
import {MyTestsService} from "@features/profile/my-tests/services/my-tests.service";
import {TestSession} from "@features/profile/test/models/test-session";
import {catchError, EMPTY, finalize, tap} from "rxjs";
import {ErrorService} from "@services/error.service";

@Injectable({
    providedIn: 'root'
})
export class MyTestsStateService {
    private readonly myTestsService = inject(MyTestsService);
    private readonly errorService = inject(ErrorService);

    readonly loading = signal<boolean>(false);

    readonly tests = signal<TestSession[]>([]);

    readonly test = signal<TestSession | null>(null);

    getById(id: number) {
        this.loading.set(true);
        this.test.set(null);
        return this.myTestsService.getById(id).pipe(
            tap(res => this.test.set(res.data)),
            catchError(err => {
                this.errorService.onError(err);
                return EMPTY;
            }),
            finalize(() => this.loading.set(false))
        );
    }

    getAllTestsCurrentUser() {
        this.loading.set(true);
        this.tests.set([]);
        return this.myTestsService.getAllTestsCurrentUser().pipe(
            tap(res => this.tests.set(res.data)),
            catchError(err => {
                this.errorService.onError(err);
                return EMPTY;
            }),
            finalize(() => this.loading.set(false))
        );
    }
}
