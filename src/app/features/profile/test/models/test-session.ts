import {User} from "@models/user";
import {TestStatus} from "@features/profile/test/models/test-status";
import {TaskGroup} from "@features/profile/test/models/task-group";

export interface TestSession {
    id: number;
    startTime: string;
    endTime: string;
    finishTime: string;
    status: TestStatus;
    user: User;
    taskGroups: TaskGroup[];
}