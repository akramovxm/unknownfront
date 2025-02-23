export interface RegistrationRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string | null;
    birthDate: string | null;
}
