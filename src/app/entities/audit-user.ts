import {Role} from "@enums/role";

export interface AuditUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: Role;
}
