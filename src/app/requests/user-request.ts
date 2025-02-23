import {Role} from "@enums/role";

export interface UserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string| null;
    birthDate: string | null;
    role: Role;
    locked: boolean;
}
