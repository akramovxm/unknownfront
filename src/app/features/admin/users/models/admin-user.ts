import {Role} from "@models/role";
import {AuditUser} from "@models/audit-user";

export interface AdminUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    birthDate: string | null;
    role: Role;
    provider: string;
    locked: boolean;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: AuditUser | null;
    updatedBy: AuditUser | null;
}
