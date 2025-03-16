import {Routes} from "@angular/router";
import {LoginComponent} from "@features/auth/pages/login/login.component";
import {RegistrationComponent} from "@features/auth/pages/registration/registration.component";
import {AccountRecoveryComponent} from "@features/auth/pages/account-recovery/account-recovery.component";
import {VerifyComponent} from "@features/auth/pages/verify/verify.component";
import {verifyGuard} from "@guards/verify.guard";
import {SetPasswordComponent} from "@features/auth/pages/set-password/set-password.component";
import {setPasswordGuard} from "@guards/set-password.guard";
import {appName} from "../../app.constants";

export const AUTH_ROUTES: Routes = [
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