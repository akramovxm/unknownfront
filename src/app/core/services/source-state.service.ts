import {inject, Injectable, signal} from '@angular/core';
import {ErrorService} from "@services/error.service";
import {SourceService} from "@services/source.service";
import {AdminSource} from "@models/admin-source";
import {catchError, finalize, map, of, tap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SourceStateService {
    private readonly sourceService = inject(SourceService);
    private readonly errorService = inject(ErrorService);

    readonly loading = signal<boolean>(false);

    readonly sources = signal<AdminSource[]>([]);

    getSources() {
        this.loading.set(true);
        return this.sourceService.getAll()
            .pipe(
                map(res => res.data),
                tap(sources => this.sources.set(sources)),
                catchError(err => {
                    this.errorService.onError(err);
                    return of([]);
                }),
                finalize(() => this.loading.set(false))
            );
    }

    createSource(name: string) {
        this.loading.set(true);
        return this.sourceService.create(name).pipe(
                tap(res => {
                    this.sources.update(sources => [res.data, ...sources]);
                }),
                catchError(err => {
                    this.errorService.onError(err);
                    return of({data: null});
                }),
                finalize(() => this.loading.set(false))
            );
    }
}
