import {Routes} from '@angular/router';
import {HomeComponent} from "@features/home/home.component";
import {AdminLayoutComponent} from "@layouts/admin-layout/admin-layout.component";
import {adminGuard} from "@guards/admin.guard";
import {ProfileComponent} from "@features/profile/profile.component";
import {authGuard} from "@guards/auth.guard";
import {Oauth2RedirectComponent} from "@features/oauth2-redirect/oauth2-redirect.component";
import {appName} from "@constants";
import {AuthLayoutComponent} from "@layouts/auth-layout/auth-layout.component";
import {notAuthGuard} from "@guards/not-auth.guard";

export const routes: Routes = [
    {
        path: '',
        title: appName + 'Home',
        component: HomeComponent
    },
    {
        path: 'oauth2/redirect',
        component: Oauth2RedirectComponent
    },
    {
        path: '',
        component: AuthLayoutComponent,
        canActivate: [notAuthGuard],
        loadChildren: () => import('@features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'admin',
        title: appName + 'Admin',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
        loadChildren: () => import('@features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    {
        path: 'profile',
        title: appName + 'Profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    },
];
