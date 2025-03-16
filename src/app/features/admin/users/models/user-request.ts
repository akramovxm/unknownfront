export interface UserRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    birthDate?: string | null;
    role: string;
    locked: boolean;
}