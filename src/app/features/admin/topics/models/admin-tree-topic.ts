import {BasicTopic} from "@features/admin/topics/models/basic-topic";
import {User} from "@models/user";

export interface AdminTreeTopic {
    id: number;
    titleUz: string;
    titleRu: string;
    seq: number;
    parent: BasicTopic | null;
    children: AdminTreeTopic[];
    prev: BasicTopic | null;
    next: BasicTopic | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User | null;
    updatedBy: User | null;
}