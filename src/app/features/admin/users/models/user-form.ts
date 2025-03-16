import {FormControl} from "@angular/forms";

export interface UserForm {
    id: FormControl<number | null>;
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    phoneNumber: FormControl<string | null>;
    birthDate: FormControl<string | null>;
    role: FormControl<string | null>;
    locked: FormControl<boolean | null>;
}