import {inject, Injectable, signal} from '@angular/core';
import {SubjectService} from "@features/admin/subjects/services/subject.service";
import { ErrorService } from '@services/error.service';
import {AdminSubject} from "@features/admin/subjects/model/admin-subject";
import {catchError, EMPTY, finalize, map, tap} from "rxjs";
import {FormGroup} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {TitleFormDialogComponent} from "@shared/components/title-form-dialog/title-form-dialog.component";
import {TitleForm} from "@models/title-form";
import {SnackbarService} from "@services/snackbar.service";
import {ConfirmDialogService} from "@services/confirm-dialog.service";

@Injectable({
    providedIn: 'root'
})
export class SubjectStateService {
    private readonly snackbarService = inject(SnackbarService);
    private readonly subjectService = inject(SubjectService);
    private readonly errorService = inject(ErrorService);
    private readonly confirmDialogService = inject(ConfirmDialogService);

    readonly loading = signal<boolean>(false);
    readonly createLoading = signal<boolean>(false);
    readonly updateLoading = signal<boolean>(false);

    readonly subjects = signal<AdminSubject[]>([]);

    getSubjects() {
        this.subjects.set([]);
        this.loading.set(true);
        return this.subjectService.getAll()
            .pipe(
                map(res => res.data),
                tap(sources => this.subjects.set(sources)),
                catchError(err => {
                    this.errorService.onError(err);
                    return EMPTY;
                }),
                finalize(() => this.loading.set(false))
            );
    }

    createSubject(form: FormGroup<TitleForm>, dialogRef: MatDialogRef<TitleFormDialogComponent> | undefined) {
        if (form.invalid) return;

        this.createLoading.set(true);
        form.disable();
        if (dialogRef) {
            dialogRef.disableClose = true;
        }
        this.subjectService.create(form.value).subscribe({
            next: res => {
                this.createLoading.set(false);
                form.enable();
                if (dialogRef) {
                    dialogRef.disableClose = false;
                    dialogRef.close();
                }
                this.subjects.update(value => [res.data, ...value]);
                this.snackbarService.open('SUBJECT_CREATED_SUCCESS');
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

    updateSubject(form: FormGroup<TitleForm>, dialogRef: MatDialogRef<TitleFormDialogComponent> | undefined, id: number) {
        if (form.invalid) return;

        this.updateLoading.set(true);
        form.disable();
        if (dialogRef) {
            dialogRef.disableClose = true;
        }
        this.subjectService.update(form.value, id).subscribe({
            next: res => {
                this.updateLoading.set(false);
                form.enable();
                if (dialogRef) {
                    dialogRef.disableClose = false;
                    dialogRef.close();
                }
                this.subjects.update(value => value.map(s => {
                    if (s.id === id) {
                        return res.data;
                    }
                    return s;
                }))
                this.snackbarService.open('SUBJECT_UPDATED_SUCCESS');
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

    deleteSubject(id: number) {
        this.confirmDialogService.loading.set(true);
        this.confirmDialogService.setDialogDisableClose(true);

        return this.subjectService.delete(id).pipe(
            tap(res => {
                if (this.confirmDialogService.dialogRef) {
                    this.confirmDialogService.dialogRef.close();
                }
                this.subjects.update(value => value.filter(s => s.id !== id))
                this.snackbarService.open('SUBJECT_DELETED_SUCCESS');
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
}
