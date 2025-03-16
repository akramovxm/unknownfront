import {Role} from "./role";

export interface AuditUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: Role;
}
