import {inject, Injectable} from '@angular/core';
import {Response} from "@models/response";
import {User} from "@models/user";
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "@constants";

@Injectable({
    providedIn: 'root'
})
export class MeService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = BACKEND_URL + '/me';

    getMe() {
        return this.http.get<Response<User>>(this.baseUrl);
    }

    updateMe(data: any) {
        return this.http.put<Response<User>>(this.baseUrl, data);
    }

    updatePassword(data: any) {
        return this.http.put<Response<null>>(this.baseUrl + '/update-password', data);
    }
}
