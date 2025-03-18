import {BasicTopic} from "@features/admin/topics/models/basic-topic";
import {AuditUser} from "@models/audit-user";

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
    createdBy: AuditUser | null;
    updatedBy: AuditUser | null;
}