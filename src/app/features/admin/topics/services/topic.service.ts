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

    private readonly baseUrl = BACKEND_URL + '/topics';

    getAll(queryParams?: { [key: string]: string | number }) {
        let params = new HttpParams();

        if (queryParams !== undefined) {
            Object.keys(queryParams).forEach(key => {
                params = params.set(key, queryParams[key]);
            });
        }

        return this.http.get<Response<AdminTopic[]>>(this.baseUrl, { params });
    }

    getAllAsTree() {
        return this.http.get<Response<AdminTreeTopic[]>>(this.baseUrl + '/as-tree');
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
