import {FormControl} from "@angular/forms";

export interface TestStartForm {
    firstSubjectId: FormControl<number | null>;
    secondSubjectId: FormControl<number | null>;
    language: FormControl<string | null>;
}