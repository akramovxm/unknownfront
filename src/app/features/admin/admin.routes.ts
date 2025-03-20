import {Routes} from "@angular/router";
import {appName} from "../../app.constants";
import {UsersMainComponent as AdminUsersComponent} from "@features/admin/users/pages/get-all/users-main.component";
import {CreateComponent as AdminUserCreateComponent} from "@features/admin/users/pages/create/create.component";
import {UpdateComponent as AdminUserUpdateComponent} from "@features/admin/users/pages/update/update.component";
import {TopicsMainComponent as AdminTopicsComponent} from "@features/admin/topics/pages/main/topics-main.component";
import {TasksMainComponent as AdminTasksGetAllComponent} from "@features/admin/tasks/pages/main/tasks-main.component";
import {CreateComponent as AdminTaskCreateComponent} from "@features/admin/tasks/pages/create/create.component";
import {UpdateComponent as AdminTaskUpdateComponent} from "@features/admin/tasks/pages/update/update.component";
import {SettingsMainComponent as AdminSettingsComponent} from "@features/admin/settings/pages/main/settings-main.component";
import { UpdatePasswordComponent as AdminUpdatePasswordComponent } from "./settings/pages/update-password/update-password.component";

export const ADMIN_ROUTES: Routes = [
    {
        path: 'users',
        title: appName + 'Users',
        component: AdminUsersComponent,
    },
    {
        path: 'users/create',
        title: appName + 'Create User',
        component: AdminUserCreateComponent
    },
    {
        path: 'users/update',
        title: appName + 'Update User',
        component: AdminUserUpdateComponent
    },
    {
        path: 'topics',
        title: appName + 'Topics',
        component: AdminTopicsComponent
    },
    {
        path: 'tasks',
        title: appName + 'Tasks',
        component: AdminTasksGetAllComponent
    },
    {
        path: 'tasks/create',
        title: appName + 'Create Task',
        component: AdminTaskCreateComponent
    },
    {
        path: 'tasks/update',
        title: appName + 'Update Task',
        component: AdminTaskUpdateComponent
    },
    {
        path: 'settings',
        title: appName + 'Settings',
        component: AdminSettingsComponent
    },
    {
        path: 'settings/update-password',
        title: appName + 'Update Password',
        component: AdminUpdatePasswordComponent
    }
]