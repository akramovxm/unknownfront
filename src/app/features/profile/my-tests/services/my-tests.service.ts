import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "@constants";
import {ListResponse} from "@models/list-response";
import {TestSession} from "@features/profile/test/models/test-session";
import {Response} from "@models/response";

@Injectable({
    providedIn: 'root'
})
export class MyTestsService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = BACKEND_URL + '/me/test';

    getAllTestsCurrentUser() {
        return this.http.get<ListResponse<TestSession>>(this.baseUrl + '/all');
    }

    getById(id: number) {
        return this.http.get<Response<TestSession>>(this.baseUrl + `/${id}`);
    }
}
