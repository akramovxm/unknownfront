import {FormControl} from "@angular/forms";

export interface SetPasswordForm {
    token: FormControl<string | null>;
    password: FormControl<string | null>;
}