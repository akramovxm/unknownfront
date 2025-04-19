import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BACKEND_URL} from "@constants";
import {Response} from "@models/response";
import {AdminTask} from "@features/admin/tasks/models/admin-task";
import {ListResponse} from "@models/list-response";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private readonly http = inject(HttpClient);

    private readonly baseUrl = BACKEND_URL + '/tasks';

    getAllSubjectId(subjectId: number, queryParams: { [key: string]: string | number }) {
        let params = new HttpParams();

        Object.keys(queryParams).forEach(key => {
            params = params.set(key, queryParams[key]);
        });

        return this.http.get<ListResponse<AdminTask>>(BACKEND_URL + '/subjects/' + subjectId + '/tasks', { params });
    }

    update(data: any, id: number) {
        return this.http.put<Response<AdminTask>>(this.baseUrl + `/${id}`, data);
    }

    create(data: any) {
        return this.http.post<Response<AdminTask>>(this.baseUrl, data);
    }

    delete(data: {ids: number[]}) {
        return this.http.delete<Response<null>>(this.baseUrl, { body: data });
    }
}
