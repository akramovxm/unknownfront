import {Routes} from '@angular/router';
import {HomeComponent} from "@pages/home/home.component";
import {LoginComponent} from "@pages/login/login.component";
import {notAuthGuard} from "@guards/not-auth.guard";
import {RegistrationComponent} from "@pages/registration/registration.component";
import {VerifyComponent} from "@pages/verify/verify.component";
import {verifyGuard} from "@guards/verify.guard";
import {AuthLayoutComponent} from "./layouts/auth-layout/auth-layout.component";
import {AdminComponent} from "@pages/admin/admin.component";
import {adminGuard} from "@guards/admin.guard";
import {ProfileComponent} from "@pages/profile/profile.component";
import {authGuard} from "@guards/auth.guard";
import {Oauth2RedirectComponent} from "@pages/oauth2-redirect/oauth2-redirect.component";
import {AccountRecoveryComponent} from "@pages/account-recovery/account-recovery.component";
import {UpdatePasswordComponent} from "@pages/update-password/update-password.component";
import {updatePasswordGuard} from "@guards/update-password.guard";

const appName = 'Unknown | ';

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
        children: [
            {
                path: 'login',
                title: appName + 'Login',
                component: LoginComponent
            },
            {
                path: 'registration',
                title: appName + "Registration",
                component: RegistrationComponent,
            },
            {
                path: 'account-recovery',
                title: appName + "Account Recovery",
                component: AccountRecoveryComponent
            },
            {
                path: 'verify',
                title: appName + "Verify",
                component: VerifyComponent,
                canActivate: [verifyGuard]
            },
            {
                path: 'update-password',
                title: appName + "Update Password",
                component: UpdatePasswordComponent,
                canActivate: [updatePasswordGuard]
            }
        ]
    },
    {
        path: 'admin',
        title: appName + 'Admin',
        component: AdminComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'profile',
        title: appName + 'Profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    },
];
