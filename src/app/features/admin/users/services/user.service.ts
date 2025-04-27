import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BACKEND_URL} from "@constants";
import {AdminUser} from "@features/admin/users/models/admin-user";
import {ListResponse} from "@models/list-response";
import {Response} from "@models/response";
import {UserRequest} from "@features/admin/users/models/user-request";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly http = inject(HttpClient);

    private readonly baseUrl = BACKEND_URL + '/admin/users';

    getAll(queryParams: { [key: string]: string | number }) {
        let params = new HttpParams();

        Object.keys(queryParams).forEach(key => {
            params = params.set(key, queryParams[key]);
        });

        return this.http.get<ListResponse<AdminUser>>(this.baseUrl, { params });
    }

    getOne(id: number) {
        return this.http.get<Response<AdminUser>>(this.baseUrl + `/${id}`);
    }

    create(data: UserRequest) {
        return this.http.post<Response<AdminUser>>(this.baseUrl, data);
    }

    updateFully(data: UserRequest, id: number) {
        return this.http.put<Response<AdminUser>>(this.baseUrl + `/${id}`, data);
    }

    updatePartially(data: UserRequest, id: number) {
        return this.http.patch<Response<AdminUser>>(this.baseUrl + `/${id}`, data);
    }

    deleteById(id: number) {
        return this.http.delete<Response<null>>(this.baseUrl + `/${id}`);
    }

    deleteByIds(data: {ids: number[]}) {
        return this.http.delete<Response<null>>(this.baseUrl, { body: data });
    }

    lockByIds(data: {ids: number[]}) {
        return this.http.put<Response<null>>(this.baseUrl + "/lock", data);
    }

    unlockByIds(data: {ids: number[]}) {
        return this.http.put<Response<null>>(this.baseUrl + "/unlock", data);
    }
}
