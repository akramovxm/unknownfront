import {Injectable, signal} from '@angular/core';
import {interval, map, Subscription, takeWhile, tap} from "rxjs";
import {TaskGroupTasksCount} from "@features/profile/test/models/task-group-tasks-count";

@Injectable({
    providedIn: 'root'
})
export class TestProcessService {
    readonly timeLeft = signal<number>(-1);
    readonly answeredTasksCount = signal<number>(0);
    readonly allTasksCount = signal<number>(0);
    readonly taskGroupTasks = signal<TaskGroupTasksCount[]>([]);

    timer?: Subscription;

    start(endTime: string) {
        const end = new Date(endTime).getTime();

        this.timer = interval(1000).pipe(
            map(() => {
                const now = new Date().getTime();
                return Math.max(Math.floor((end - now) / 1000), 0);
            }),
            tap(seconds => this.timeLeft.set(seconds)),
            takeWhile(seconds => seconds >= 0)
        ).subscribe();
    }
}
