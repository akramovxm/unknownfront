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
import {UsersComponent as AdminUsersComponent} from "@pages/admin/users/users.component";
import {CreateComponent as UserCreateComponent} from "@pages/admin/users/create/create.component";
import {SetPasswordComponent} from "@pages/set-password/set-password.component";
import {setPasswordGuard} from "@guards/set-password.guard";
import {UpdateComponent as UserUpdateComponent} from "@pages/admin/users/update/update.component";

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
                path: 'set-password',
                title: appName + "Set Password",
                component: SetPasswordComponent,
                canActivate: [setPasswordGuard]
            }
        ]
    },
    {
        path: 'admin',
        title: appName + 'Admin',
        component: AdminComponent,
        canActivate: [adminGuard],
        children: [
            {
                path: 'users',
                title: appName + 'Users',
                component: AdminUsersComponent
            },
            {
                path: 'users/create',
                title: appName + 'Create User',
                component: UserCreateComponent
            },
            {
                path: 'users/update',
                title: appName + 'Update User',
                component: UserUpdateComponent
            }
        ]
    },
    {
        path: 'profile',
        title: appName + 'Profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    },
];
