import {Routes} from "@angular/router";
import {appName} from "../../app.constants";
import {GetAllComponent as AdminUsersComponent} from "@features/admin/users/pages/get-all/get-all.component";
import {CreateComponent as AdminUserCreateComponent} from "@features/admin/users/pages/create/create.component";
import {UpdateComponent as AdminUserUpdateComponent} from "@features/admin/users/pages/update/update.component";
import {GetAllComponent as AdminTopicsComponent} from "@features/admin/topics/pages/get-all/get-all.component";
import {GetAllComponent as AdminTasksGetAllComponent} from "@features/admin/tasks/pages/get-all/get-all.component";
import {CreateComponent as AdminTaskCreateComponent} from "@features/admin/tasks/pages/create/create.component";
import {UpdateComponent as AdminTaskUpdateComponent} from "@features/admin/tasks/pages/update/update.component";

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
    }
]