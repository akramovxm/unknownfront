import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "@constants";
import {TestSession} from "@features/profile/test/models/test-session";
import {Response} from "@models/response";
import {TaskSnapshot} from "@features/profile/test/models/task-snapshot";

@Injectable({
    providedIn: 'root'
})
export class TestService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = BACKEND_URL + '/me/test';

    getTestCurrentUser() {
        return this.http.get<Response<TestSession | null>>(this.baseUrl + '/current');
    }

    start(data: any) {
        return this.http.post<Response<TestSession>>(this.baseUrl + `/start`, data);
    }

    selectAnswer(data: any) {
        return this.http.put<Response<TaskSnapshot>>(this.baseUrl + '/select-answer', data);
    }

    finish() {
        return this.http.put<Response<TestSession | null>>(this.baseUrl + '/finish', null);
    }

    timeout() {
        return this.http.put<Response<TestSession | null>>(this.baseUrl + '/timeout', null);
    }
}
