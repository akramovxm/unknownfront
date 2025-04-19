import {inject, Injectable} from '@angular/core';
import {AuthResponse} from "@models/auth-response";
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "@constants";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = BACKEND_URL + '/auth';

    login(data: any) {
        return this.http.post<AuthResponse>(this.baseUrl + '/login', data);
    }

    registration(data: any) {
        return this.http.post<AuthResponse>(this.baseUrl + '/registration', data);
    }

    verifyRegistration(data: any) {
        return this.http.post<AuthResponse>(this.baseUrl + '/verify-registration', data);
    }

    verifyRecovery(data: any) {
        return this.http.post<AuthResponse>(this.baseUrl + '/verify-recovery', data);
    }

    sendCode(email: string | undefined | null) {
        return this.http.post<AuthResponse>(this.baseUrl + '/send-code', {email});
    }

    setPassword(data: any) {
        return this.http.post<AuthResponse>(this.baseUrl + '/set-password', data);
    }
}
