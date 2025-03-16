import {AdminTopic} from "@features/admin/topics/models/admin-topic";
import {AuditUser} from "@models/audit-user";
import {AdminSource} from "@models/admin-source";

export interface AdminTask {
    id: number;
    contentUz: string;
    contentRu: string;
    level: string;
    type: string;
    topic: AdminTopic | null;
    source: AdminSource | null;
    answers: AdminAnswer[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: AuditUser | null;
    updatedBy: AuditUser | null;
}

export interface AdminAnswer {
    id: number;
    valueUz: string;
    valueRu: string;
    correct: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: AuditUser | null;
    updatedBy: AuditUser | null;
}