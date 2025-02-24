import {inject, Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../app.constants";
import {LoginRequest} from "@requests/login-request";
import {AuthResponse} from "@responses/auth-response";
import {Role} from "@enums/role";
import {RegistrationRequest} from "@requests/registration-request";
import {VerifyRequest} from "@requests/verify-request";
import {DecodedToken} from "@entities/decoded-token";
import {jwtDecode} from "jwt-decode";
import {SetPasswordRequest} from "@requests/set-password-request";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    router = inject(Router);
    http = inject(HttpClient);

    baseUrl = BACKEND_URL;

    loginLoading = false;
    registrationLoading = false;
    verifyLoading = false;

    auth;
    role;

    constructor() {
        this.auth = !this.isTokenExpired();
        this.role = this.getRoleFromToken();
    }

    login(data: LoginRequest) {
        return this.http.post<AuthResponse>(this.baseUrl + '/auth/login', data);
    }

    onLoginSuccess(token: string) {
        this.loginLoading = false;
        this.setToken(token);
        sessionStorage.removeItem("email");
        this.auth = true;
        const decodedToken = this.decodeToken(token);
        this.role = decodedToken.role;
        let route = '/profile';
        if (this.role === Role.ADMIN) {
            route = '/admin'
        }
        this.router.navigate([route]);
    }

    logout() {
        this.removeToken();
        this.role = null;
        this.auth = false;
        this.router.navigate(['/login']);
    }

    registration(data: RegistrationRequest) {
        return this.http.post<AuthResponse>(this.baseUrl + '/auth/registration', data);
    }

    verify(data: VerifyRequest) {
        return this.http.post<AuthResponse>(this.baseUrl + '/auth/verify', data);
    }

    resendCode(email: string | undefined | null) {
        return this.http.post<AuthResponse>(this.baseUrl + '/auth/send-code', {email});
    }

    setPassword(data: SetPasswordRequest) {
        return this.http.post<AuthResponse>(this.baseUrl + '/auth/set-password', data);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    removeToken() {
        localStorage.removeItem('token');
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    decodeToken(token: string): DecodedToken {
        return jwtDecode(token);
    }

    isTokenExpired() {
        const token = this.getToken();
        if (token === null) return true;
        const decodedToken = this.decodeToken(token);
        if (!decodedToken.exp) return true;
        const expirationDate = decodedToken.exp * 1000;
        const now = new Date().getTime();

        return expirationDate < now;
    }

    getRoleFromToken() {
        const token = this.getToken();
        if (token === null) return null;
        const decodedToken = this.decodeToken(token);
        return decodedToken.role;
    }
}
