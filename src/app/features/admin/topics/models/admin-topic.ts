import {AuditUser} from "@models/audit-user";
import {BasicTopic} from "@features/admin/topics/models/basic-topic";

export interface AdminTopic {
    id: number;
    titleUz: string;
    titleRu: string;
    seq: number;
    prev: BasicTopic | null;
    next: BasicTopic | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: AuditUser | null;
    updatedBy: AuditUser | null;
}
