import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BACKEND_URL} from "../../app.constants";
import {Response} from "@models/response";
import {AdminSource} from "@models/admin-source";

@Injectable({
    providedIn: 'root'
})
export class SourceService {
    http = inject(HttpClient);

    baseUrl = BACKEND_URL + '/sources';

    getAll(queryParams?: { [key: string]: string | number }) {
        let params = new HttpParams();

        if (queryParams !== undefined) {
            Object.keys(queryParams).forEach(key => {
                params = params.set(key, queryParams[key]);
            });
        }

        return this.http.get<Response<AdminSource[]>>(this.baseUrl, { params });
    }

    update(data: any, id: number) {
        return this.http.put<Response<AdminSource>>(this.baseUrl + `/${id}`, data);
    }

    create(name: string) {
        return this.http.post<Response<AdminSource>>(this.baseUrl, { name });
    }

    delete(id: number) {
        return this.http.delete<Response<null>>(this.baseUrl + `/${id}`);
    }
}
