import {inject, Injectable, signal} from "@angular/core";
import {DecodedToken} from "@models/decoded-token";
import {jwtDecode} from "jwt-decode";
import {Role} from "@models/role";
import {FormGroup} from "@angular/forms";
import {LoginForm} from "@features/auth/models/login-form";
import {AuthService} from "@features/auth/services/auth.service";
import {Router} from "@angular/router";
import {SnackbarService} from "@services/snackbar.service";
import {ErrorService} from "@services/error.service";
import {EmailForm} from "@features/auth/models/email-form";
import {HttpErrorResponse} from "@angular/common/http";
import {RegistrationForm} from "@features/auth/models/registration-form";
import {SetPasswordForm} from "@features/auth/models/set-password-form";
import {VerifyForm} from "@features/auth/models/verify-form";

@Injectable({
    providedIn: 'root'
})
export class AuthStateService {
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    private readonly errorService = inject(ErrorService);
    private readonly snackbarService = inject(SnackbarService);

    readonly loading = signal<boolean>(false);
    readonly resendLoading = signal<boolean>(false);

    readonly auth = signal<boolean>(false);
    readonly role = signal<string | null>(null);

    constructor() {
        this.auth.set(!this.isTokenExpired());
        this.role.set(this.getRoleFromToken());
    }

    login(form: FormGroup<LoginForm>) {
        if (form.invalid) return;

        this.loading.set(true);
        form.disable();
        this.authService.login(form.value).subscribe({
            next: res => {
                this.loading.set(false);
                form.enable();
                this.onLoginSuccess(res.token);
                let route = '/profile';
                if (this.isAdmin()) {
                    route = '/admin'
                }
                this.router.navigate([route]);
            },
            error: err => {
                this.loading.set(false);
                form.enable();
                if (err.error.errors === null) {
                    this.snackbarService.open("EMAIL_PASSWORD_INCORRECT");
                }
                this.errorService.onError(err);
            }
        });
    }

    registration(form: FormGroup<RegistrationForm>) {
        if (form.invalid) return;

        this.loading.set(true);
        form.disable();
        this.authService.registration(form.value).subscribe({
            next: res => {
                this.loading.set(false);
                form.enable();
                if (form.value.email) {
                    this.setVerifyType(form.value.email, 'registration');
                }
                this.router.navigate(['/verify']);
            },
            error: (err: HttpErrorResponse) => {
                this.loading.set(false);
                form.enable();
                this.errorService.onError(err, form, ['exists']);
            }
        });
    }

    recovery(form: FormGroup<EmailForm>) {
        if (form.invalid) return;

        this.loading.set(true);
        form.disable();
        this.authService.sendCode(form.value.email).subscribe({
            next: res => {
                this.loading.set(false);
                form.enable();
                if (form.value.email) {
                    this.setVerifyType(form.value.email, 'recovery');
                }
                this.router.navigate(['/verify']);
            },
            error: err => {
                this.loading.set(false);
                form.enable();
                this.errorService.onError(err, form, ['notFound']);
            }
        });
    }

    resendCode(form: FormGroup<VerifyForm>) {
        this.resendLoading.set(true);
        this.authService.sendCode(form.value.email).subscribe({
                next: res => {
                    this.resendLoading.set(false);
                    this.snackbarService.open('SEND_CODE_SUCCESS');
                },
                error: err => {
                    this.resendLoading.set(false);
                    this.errorService.onError(err);
                }
            });
    }

    verify(form: FormGroup<VerifyForm>) {
        if (form.invalid) return;

        this.loading.set(true);
        form.disable();

        if (sessionStorage.getItem('verifyType') === 'recovery') {
            this.authService.verifyRecovery(form.value).subscribe({
                next: res => {
                    this.loading.set(false);
                    form.enable();
                    this.snackbarService.open('VERIFY_SUCCESS');
                    sessionStorage.setItem('recoveryToken', res.token);
                    this.router.navigate(['/set-password']);
                },
                error: err => {
                    this.loading.set(false);
                    form.enable();
                    this.errorService.onError(err, form, ['incorrect']);
                }
            })
        } else {
            this.authService.verify(form.value).subscribe({
                next: res => {
                    this.loading.set(false);
                    form.enable();
                    this.snackbarService.open('VERIFY_SUCCESS');
                    sessionStorage.removeItem('email');
                    sessionStorage.removeItem('recoveryToken');
                    sessionStorage.removeItem('verifyType');
                    this.router.navigate(['/login']);
                },
                error: err => {
                    this.loading.set(false);
                    form.enable();
                    this.errorService.onError(err, form, ['incorrect']);
                }
            });
        }
    }

    setPassword(form: FormGroup<SetPasswordForm>) {
        if (form.invalid) return;

        this.loading.set(true);
        form.disable();
        this.authService.setPassword(form.value).subscribe({
            next: res => {
                this.loading.set(false);
                form.enable();
                this.snackbarService.open('SET_PASSWORD_SUCCESS');
                this.removeVerifyType();
                this.router.navigate(['/login']);
            },
            error: err => {
                this.loading.set(false);
                form.enable();
                this.errorService.onError(err);
            }
        });
    }

    onLoginSuccess(token: string) {
        this.setToken(token);
        sessionStorage.removeItem("email");
        this.auth.set(true);
        const decodedToken = this.decodeToken(token);
        this.role.set(decodedToken.role);
    }

    logout() {
        this.removeToken();
        this.role.set(null);
        this.auth.set(false);
    }

    isAdmin() {
        return this.role() === Role.ADMIN || this.role() === Role.SUPERADMIN;
    }

    private setVerifyType(email: string, verifyType: string) {
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('verifyType', verifyType);
    }

    removeVerifyType() {
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('recoveryToken');
        sessionStorage.removeItem('verifyType');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    private removeToken() {
        localStorage.removeItem('token');
    }

    private setToken(token: string) {
        localStorage.setItem('token', token);
    }

    private decodeToken(token: string): DecodedToken {
        return jwtDecode(token);
    }

    private isTokenExpired() {
        const token = this.getToken();
        if (token === null) return true;
        const decodedToken = this.decodeToken(token);
        if (!decodedToken.exp) return true;
        const expirationDate = decodedToken.exp * 1000;
        const now = new Date().getTime();

        return expirationDate < now;
    }

    private getRoleFromToken() {
        const token = this.getToken();
        if (token === null) return null;
        const decodedToken = this.decodeToken(token);
        return decodedToken.role;
    }

    getEmailFromToken() {
        const token = this.getToken();
        if (token === null) return null;
        const decodedToken = this.decodeToken(token);
        return decodedToken.sub;
    }
}