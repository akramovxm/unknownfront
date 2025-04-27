import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "@constants";
import {ListResponse} from "@models/list-response";
import {Response} from "@models/response";
import {AdminSubject} from "@features/admin/subjects/models/admin-subject";

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = BACKEND_URL + '/admin/subjects';

    getAll() {
        return this.http.get<ListResponse<AdminSubject>>(this.baseUrl);
    }

    update(data: any, id: number) {
        return this.http.put<Response<AdminSubject>>(this.baseUrl + `/${id}`, data);
    }

    create(data: any) {
        return this.http.post<Response<AdminSubject>>(this.baseUrl, data);
    }

    delete(id: number) {
        return this.http.delete<Response<null>>(this.baseUrl + `/${id}`);
    }
}
