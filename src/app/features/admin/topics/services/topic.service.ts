import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BACKEND_URL} from "../../../../app.constants";
import {AdminTopic} from "@features/admin/topics/models/admin-topic";
import {Response} from "@models/response";
import {AdminTreeTopic} from "@features/admin/topics/models/admin-tree-topic";
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TopicService {
    http = inject(HttpClient);

    baseUrl = BACKEND_URL + '/topics';

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

    getByPath(path: string) {
        return this.http.get<Response<AdminTopic>>(this.baseUrl + `/${path}`);
    }

    updateTopics(data: any[]) {
        return this.http.put<Response<null>>(this.baseUrl, data);
    }

    updateTopic(data: any, id: number) {
        return this.http.put<Response<AdminTopic>>(this.baseUrl + `/${id}`, data);
    }

    create(data: any) {
        return this.http.post<Response<AdminTopic>>(this.baseUrl, data);
    }

    deleteTopic(id: number) {
        return this.http.delete<Response<null>>(this.baseUrl + `/${id}`);
    }
}
