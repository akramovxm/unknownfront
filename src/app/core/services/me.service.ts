import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../app.constants";
import {Response} from "@models/response";
import {User} from "@models/user";

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
        return this.http.put(this.baseUrl + '/update-password', data);
    }
}
