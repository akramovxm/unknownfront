import {Role} from "@models/role";
import {User} from "@models/user";

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
    createdBy: User | null;
    updatedBy: User | null;
}
