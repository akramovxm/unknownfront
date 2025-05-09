import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BACKEND_URL} from "@constants";
import {AdminTopic} from "@features/admin/topics/models/admin-topic";
import {Response} from "@models/response";
import {AdminTreeTopic} from "@features/admin/topics/models/admin-tree-topic";

@Injectable({
    providedIn: 'root'
})
export class TopicService {
    private readonly http = inject(HttpClient);

    private readonly baseUrl = BACKEND_URL + '/admin/topics';

    getAllSubjectId(subjectId: number, queryParams?: { [key: string]: string | number }) {
        let params = new HttpParams();

        if (queryParams !== undefined) {
            Object.keys(queryParams).forEach(key => {
                params = params.set(key, queryParams[key]);
            });
        }

        return this.http.get<Response<AdminTopic[]>>(BACKEND_URL + '/admin/subjects/' + subjectId + '/topics', { params });
    }

    getAllBySubjectIdAsTree(subjectId: number) {
        return this.http.get<Response<AdminTreeTopic[]>>(BACKEND_URL + '/admin/subjects/' + subjectId + '/topics/as-tree');
    }

    create(data: any) {
        return this.http.post<Response<AdminTreeTopic>>(this.baseUrl, data);
    }

    update(data: any, id: number) {
        return this.http.put<Response<AdminTreeTopic>>(this.baseUrl + `/${id}`, data);
    }

    delete(id: number) {
        return this.http.delete<Response<null>>(this.baseUrl + `/${id}`);
    }
}
