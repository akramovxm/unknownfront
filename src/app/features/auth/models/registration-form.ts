import {FormControl} from "@angular/forms";

export interface RegistrationForm {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    phoneNumber: FormControl<string | null>;
    birthDate: FormControl<string | null>;
}