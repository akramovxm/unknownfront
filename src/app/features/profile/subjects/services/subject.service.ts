import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "@constants";
import {ListResponse} from "@models/list-response";
import {Subject} from "@features/profile/subjects/models/subject";

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = BACKEND_URL + '/subjects';

    getAll() {
        return this.http.get<ListResponse<Subject>>(this.baseUrl);
    }
}
