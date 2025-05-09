import {Routes} from "@angular/router";
import {appName} from "@constants";
import {UsersMainComponent} from "@features/admin/users/pages/main/users-main.component";
import {UserCreateComponent} from "@features/admin/users/pages/create/user-create.component";
import {UserUpdateComponent} from "@features/admin/users/pages/update/user-update.component";
import {TopicsMainComponent} from "@features/admin/topics/pages/main/topics-main.component";
import {TasksMainComponent} from "@features/admin/tasks/pages/main/tasks-main.component";
import {TaskCreateComponent} from "@features/admin/tasks/pages/create/task-create.component";
import {TaskUpdateComponent} from "@features/admin/tasks/pages/update/task-update.component";
import {SettingsMainComponent} from "@features/admin/settings/pages/main/settings-main.component";
import {UpdatePasswordComponent} from "./settings/pages/update-password/update-password.component";
import {UsersDetailsComponent} from "@features/admin/users/pages/details/users-details.component";
import {TaskDetailsComponent} from "@features/admin/tasks/pages/details/task-details.component";
import {SubjectMainComponent} from "@features/admin/subjects/pages/main/subject-main.component";
import {DashboardMainComponent} from "@features/admin/dashboard/pages/dashboard-main/dashboard-main.component";

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        title: appName + 'Admin',
        component: DashboardMainComponent,
    },
    {
        path: 'tasks/create',
        title: appName + 'Create Task',
        component: TaskCreateComponent
    },
    {
        path: 'users',
        title: appName + 'Users',
        component: UsersMainComponent,
    },
    {
        path: 'users/details',
        title: appName + 'User Details',
        component: UsersDetailsComponent,
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
    },
    {
        path: 'subjects',
        title: appName + 'Subjects',
        component: SubjectMainComponent
    },
    {
        path: 'subjects/:subjectId/topics',
        title: appName + 'Topics',
        component: TopicsMainComponent
    },
    {
        path: 'subjects/:subjectId/tasks',
        title: appName + 'Tasks',
        component: TasksMainComponent
    },
    {
        path: 'subjects/:subjectId/tasks/details',
        title: appName + 'Task Details',
        component: TaskDetailsComponent,
    },
    {
        path: 'subjects/:subjectId/tasks/create',
        title: appName + 'Create Task',
        component: TaskCreateComponent
    },
    {
        path: 'subjects/:subjectId/tasks/update',
        title: appName + 'Update Task',
        component: TaskUpdateComponent
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