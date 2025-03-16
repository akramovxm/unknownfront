import {AuditUser} from "./audit-user";

export interface AdminSource {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: AuditUser | null;
    updatedBy: AuditUser | null;
}