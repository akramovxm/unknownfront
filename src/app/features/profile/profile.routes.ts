import {Routes} from "@angular/router";
import {appName} from "@constants";
import {SettingsMainComponent} from "@features/admin/settings/pages/main/settings-main.component";
import {UpdatePasswordComponent} from "@features/admin/settings/pages/update-password/update-password.component";
import {SubjectMainComponent} from "@features/profile/subjects/pages/main/subject-main.component";
import {TestMainComponent} from "@features/profile/test/pages/main/test-main.component";
import {MyTestsMainComponent} from "@features/profile/my-tests/pages/my-tests-main/my-tests-main.component";
import {MyTestsDetailsComponent} from "@features/profile/my-tests/pages/my-tests-details/my-tests-details.component";
import {DashboardMainComponent} from "@features/profile/dashboard/pages/dashboard-main/dashboard-main.component";

export const PROFILE_ROUTES: Routes = [
    {
        path: '',
        title: appName + 'Profile',
        component: DashboardMainComponent
    },
    {
        path: 'subjects',
        title: appName + 'Subjects',
        component: SubjectMainComponent
    },
    {
        path: 'test',
        title: appName + 'Test',
        component: TestMainComponent
    },
    {
        path: 'my-tests',
        title: appName + 'My Tests',
        component: MyTestsMainComponent
    },
    {
        path: 'my-tests/:testId',
        title: appName + 'Test Details',
        component: MyTestsDetailsComponent
    },
    {
        path: 'settings',
        title: appName + 'Settings',
        component: SettingsMainComponent
    },
    {
        path: 'settings/update-password',
        title: appName + 'Update Password',
        component: UpdatePasswordComponent
    }
]