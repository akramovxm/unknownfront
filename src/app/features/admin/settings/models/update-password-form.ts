import { FormControl } from "@angular/forms";

export interface UpdatePasswordForm {
    oldPassword: FormControl<string | null>;
    newPassword: FormControl<string | null>;
}