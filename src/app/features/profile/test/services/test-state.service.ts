import {inject, Injectable, signal} from '@angular/core';
import {TestSession} from "@features/profile/test/models/test-session";
import {TestService} from "@features/profile/test/services/test.service";
import {catchError, EMPTY, finalize, map, tap} from "rxjs";
import {ErrorService} from "@services/error.service";
import {MatDialog} from "@angular/material/dialog";
import {
    TestResultDialogComponent
} from "@features/profile/test/components/test-result-dialog/test-result-dialog.component";
import {TestProcessService} from "@features/profile/test/services/test-process.service";
import {TestStartForm} from "@features/profile/test/models/test-start-form";
import {FormGroup} from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class TestStateService {
    private readonly dialog = inject(MatDialog);
    private readonly testService = inject(TestService);
    private readonly testProcessService = inject(TestProcessService);
    private readonly errorService = inject(ErrorService);

    readonly submitted = signal<boolean>(false);
    readonly loading = signal<boolean>(false);
    readonly testSession = signal<TestSession | null>(null);

    getTestCurrentUser() {
        this.loading.set(true);
        this.testSession.set(null);
        return this.testService.getTestCurrentUser().pipe(
            tap(res => this.testSession.set(res.data)),
            catchError(err => {
                this.errorService.onError(err);
                return EMPTY;
            }),
            finalize(() => this.loading.set(false))
        )
    }

    start(form: FormGroup<TestStartForm>) {
        this.submitted.set(true);
        this.loading.set(true);
        return this.testService.start(form.value).pipe(
            tap(res => {
                this.testSession.set(res.data);
                this.submitted.set(false);
            }),
            catchError(err => {
                this.errorService.onError(err);
                return EMPTY;
            }),
            finalize(() => this.loading.set(false))
        );
    }

    selectAnswer(data: {taskSnapshotId: number, answerSnapshotId: number}) {
        return this.testService.selectAnswer(data).pipe(
            map(res => res.data),
            catchError(err => {
                this.errorService.onError(err);
                return EMPTY;
            })
        );
    }

    finish() {
        return this.testService.finish().pipe(
            tap(res => {
                this.testProcessService.timer?.unsubscribe();
                this.testSession.set(null);
                this.dialog.open(TestResultDialogComponent, {
                    width: '480px', autoFocus: false,
                    data: {testSession: res.data}
                });
            }),
            catchError(err => {
                this.errorService.onError(err);
                return EMPTY;
            })
        );
    }

    timeout() {
        return this.testService.timeout().pipe(
            tap(res => {
                this.testProcessService.timer?.unsubscribe();
                this.testSession.set(null);
                this.dialog.open(TestResultDialogComponent, {
                    width: '480px', autoFocus: false,
                    data: {testSession: res.data}
                });
            }),
            catchError(err => {
                this.errorService.onError(err);
                return EMPTY;
            })
        )
    }
}
