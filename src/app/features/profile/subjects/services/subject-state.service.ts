import {inject, Injectable, signal} from '@angular/core';
import {catchError, EMPTY, finalize, map, tap} from "rxjs";
import {SubjectService} from "@features/admin/subjects/services/subject.service";
import {Subject} from "@features/profile/subjects/models/subject";
import {ErrorService} from "@services/error.service";

@Injectable({
    providedIn: 'root'
})
export class SubjectStateService {
    private readonly subjectService = inject(SubjectService);
    private readonly errorService = inject(ErrorService);

    readonly loading = signal<boolean>(false);

    readonly subjects = signal<Subject[]>([]);

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
}
