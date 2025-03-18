import {inject, Injectable, signal} from '@angular/core';
import {catchError, finalize, map, of, tap, EMPTY} from "rxjs";
import {AdminTopic} from "@features/admin/topics/models/admin-topic";
import {TopicService} from "@features/admin/topics/services/topic.service";
import {ErrorService} from "@services/error.service";
import {AdminTreeTopic} from "@features/admin/topics/models/admin-tree-topic";
import { FormGroup } from '@angular/forms';
import { TopicForm } from '../models/topic-form';
import {SnackbarService} from "@services/snackbar.service";
import { MatDialogRef } from '@angular/material/dialog';
import { TopicFormDialogComponent } from '../components/topic-form-dialog/topic-form-dialog.component';
import {ConfirmDialogService} from "@services/confirm-dialog.service";

@Injectable({
    providedIn: 'root'
})
export class TopicStateService {
    private readonly snackbarService = inject(SnackbarService);
    private readonly confirmDialogService = inject(ConfirmDialogService);
    private readonly topicService = inject(TopicService);
    private readonly errorService = inject(ErrorService);

    readonly loading = signal<boolean>(false);
    readonly treeLoading = signal<boolean>(false);
    readonly createLoading = signal<boolean>(false);
    readonly updateLoading = signal<boolean>(false);

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

    createTopic(form: FormGroup<TopicForm>, dialogRef: MatDialogRef<TopicFormDialogComponent> | undefined) {
        if (form.invalid) return;

        this.createLoading.set(true);
        form.disable();
        if (dialogRef) {
            dialogRef.disableClose = true;
        }
        this.topicService.create(form.value).subscribe({
            next: res => {
                this.createLoading.set(false);
                form.enable();
                if (dialogRef) {
                    dialogRef.disableClose = false;
                    dialogRef.close();
                }
                let tree = structuredClone(this.treeTopics());
                if (res.data.parent) {
                    let parent = this.findTopicById(tree, res.data.parent.id);
                    if (parent) {
                        parent.children.push(res.data);
                    }
                } else {
                    tree.push(res.data);
                }
                this.treeTopics.set(tree);
                this.snackbarService.open('TOPIC_CREATED_SUCCESS');
            },
            error: err => {
                this.createLoading.set(false);
                form.enable();
                if (dialogRef) {
                    dialogRef.disableClose = false;
                }
                this.errorService.onError(err, form, ['exists']);
            }
        });
    }

    updateTopic(form: FormGroup<TopicForm>, dialogRef: MatDialogRef<TopicFormDialogComponent> | undefined, id: number) {
        if (form.invalid) return;

        this.updateLoading.set(true);
        form.disable();
        if (dialogRef) {
            dialogRef.disableClose = true;
        }
        this.topicService.update(form.value, id).subscribe({
            next: res => {
                this.updateLoading.set(false);
                form.enable();
                if (dialogRef) {
                    dialogRef.disableClose = false;
                    dialogRef.close();
                }
                let tree = structuredClone(this.treeTopics());

                let topic = this.findTopicById(tree, res.data.id);

                if (topic) {
                    topic.titleUz = res.data.titleUz;
                    topic.titleRu = res.data.titleRu;
                }
                
                this.treeTopics.set(tree);
                this.snackbarService.open('TOPIC_UPDATED_SUCCESS');
            },
            error: err => {
                this.updateLoading.set(false);
                form.enable();
                if (dialogRef) {
                    dialogRef.disableClose = false;
                }
                this.errorService.onError(err, form, ['exists']);
            }
        });
    }

    deleteTopic(id: number) {
        this.confirmDialogService.loading.set(true);
        this.confirmDialogService.setDialogDisableClose(true);

        return this.topicService.delete(id).pipe(
            tap(res => {
                if (this.confirmDialogService.dialogRef) {
                    this.confirmDialogService.dialogRef.close();
                }
                let tree = structuredClone(this.treeTopics());
                this.removeTopicById(tree, id);
                this.treeTopics.set(tree);
                this.snackbarService.open('TOPIC_DELETED_SUCCESS');
            }),
            finalize(() => {
                this.confirmDialogService.loading.set(false);
                this.confirmDialogService.setDialogDisableClose(false);
            }),
            catchError(err => {
                this.errorService.onError(err);
                return EMPTY;
            })
        )
    }

    private findTopicById(tree: AdminTreeTopic[], id: number): AdminTreeTopic | null {
        for (const node of tree) {
            if (node.id === id) {
              return node;
            }
        
            const foundInChildren = this.findTopicById(node.children, id);
            if (foundInChildren) {
              return foundInChildren;
            }
          }
        
          return null;
    }

    private removeTopicById(tree: AdminTreeTopic[], id: number): boolean {
        for (let i = tree.length - 1; i >= 0; i--) {
            const node = tree[i];
            if (node.id === id) {
                tree.splice(i, 1);
                return true;
            } else if (this.removeTopicById(node.children, id)) {
                return true;
            }
        }
        return false;
    }
}
