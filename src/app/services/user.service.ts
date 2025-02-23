import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BACKEND_URL} from "../app.constants";
import {AdminUser} from "@entities/admin-user";
import {ListResponse} from "@responses/list-response";
import {UserRequest} from "@requests/user-request";
import {Response} from "@responses/response";
import {IdRequest} from "@requests/id-request";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    http = inject(HttpClient);

    baseUrl = BACKEND_URL + '/admin/users';

    users: AdminUser[] = [];

    loading = false;

    getAll(queryParams: { [key: string]: string | number }) {
        let params = new HttpParams();

        Object.keys(queryParams).forEach(key => {
            params = params.set(key, queryParams[key]);
        });

        return this.http.get<ListResponse<AdminUser[]>>(this.baseUrl, { params });
    }

    create(data: UserRequest) {
        return this.http.post<Response<AdminUser>>(this.baseUrl, data);
    }

    update(data: UserRequest, id: number) {
        return this.http.put<Response<AdminUser>>(this.baseUrl + `/${id}`, data);
    }

    delete(data: IdRequest) {
        return this.http.delete<Response<null>>(this.baseUrl, { body: data });
    }

    lock(data: IdRequest) {
        return this.http.put<Response<null>>(this.baseUrl + "/lock", data);
    }

    unlock(data: IdRequest) {
        return this.http.put<Response<null>>(this.baseUrl + "/unlock", data);
    }

    test(query: string) {
        return this.http.get(`https://jsonplaceholder.typicode.com/posts`);
    }
}
