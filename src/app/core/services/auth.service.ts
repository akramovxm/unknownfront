import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../app.constants";
import {AuthResponse} from "@models/auth-response";
import {Role} from "@models/role";
import {DecodedToken} from "@models/decoded-token";
import {jwtDecode} from "jwt-decode";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    router = inject(Router);
    http = inject(HttpClient);

    baseUrl = BACKEND_URL;

    loading = signal(false);
    verifyLoading = signal(false);

    auth;
    role;

    constructor() {
        this.auth = !this.isTokenExpired();
        this.role = this.getRoleFromToken();
    }

    login(data: any) {
        return this.http.post<AuthResponse>(this.baseUrl + '/auth/login', data);
    }

    onLoginSuccess(token: string, loading?: WritableSignal<boolean>) {
        loading?.set(false);
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

    registration(data: any) {
        return this.http.post<AuthResponse>(this.baseUrl + '/auth/registration', data);
    }

    verify(data: any) {
        return this.http.post<AuthResponse>(this.baseUrl + '/auth/verify', data);
    }

    resendCode(email: string | undefined | null) {
        return this.http.post<AuthResponse>(this.baseUrl + '/auth/send-code', {email});
    }

    setPassword(data: any) {
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
