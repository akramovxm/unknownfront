import {inject, Injectable, signal} from '@angular/core';
import {catchError, finalize, map, of, tap} from "rxjs";
import {AdminTopic} from "@features/admin/topics/models/admin-topic";
import {TopicService} from "@features/admin/topics/services/topic.service";
import {ErrorService} from "@services/error.service";
import {AdminTreeTopic} from "@features/admin/topics/models/admin-tree-topic";

@Injectable({
    providedIn: 'root'
})
export class TopicStateService {
    topicService = inject(TopicService);
    errorService = inject(ErrorService);

    loading = signal<boolean>(false);
    treeLoading = signal<boolean>(false);

    topics = signal<AdminTopic[]>([]);
    treeTopics = signal<AdminTreeTopic[]>([]);

    getTopics() {
        this.loading.set(true);
        return this.topicService.getAll()
            .pipe(
                map(res => res.data),
                tap(topics => this.topics.set(topics)),
                catchError(err => {
                    this.errorService.onError(err);
                    return of([]);
                }),
                finalize(() => this.loading.set(false))
            );
    }

    getTreeTopics() {
        this.treeLoading.set(true);
        return this.topicService.getAllAsTree()
            .pipe(
                map(res => res.data),
                tap(topics => this.treeTopics.set(topics)),
                catchError(err => {
                    this.errorService.onError(err);
                    return of([]);
                }),
                finalize(() => this.treeLoading.set(false))
            );
    }
}
