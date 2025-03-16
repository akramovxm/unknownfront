import {FormControl} from "@angular/forms";

export interface VerifyForm {
    email: FormControl<string | null>;
    verifyCode: FormControl<string | null>;
}