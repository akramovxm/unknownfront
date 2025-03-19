import {FormControl} from "@angular/forms";

export interface SettingsForm {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    phoneNumber: FormControl<string | null>;
    birthDate: FormControl<string | null>;
}