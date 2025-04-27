import {GroupType} from "@features/profile/test/models/group-type";
import {Subject} from "@features/profile/subjects/models/subject";
import {TaskSnapshot} from "@features/profile/test/models/task-snapshot";

export interface TaskGroup {
    id: number;
    type: GroupType;
    seq: number;
    subject: Subject;
    tasks: TaskSnapshot[];
}