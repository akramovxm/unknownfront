import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideEnvironmentNgxMask} from "ngx-mask";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "@interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideEnvironmentNgxMask(),
        provideHttpClient(withInterceptors([authInterceptor]))
    ]
};
