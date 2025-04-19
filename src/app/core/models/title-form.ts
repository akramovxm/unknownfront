import { FormControl } from "@angular/forms";

export interface TitleForm {
    titleUz: FormControl<string | null>;
    titleRu: FormControl<string | null>;
}