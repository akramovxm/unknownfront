import { FormControl } from "@angular/forms";

export interface TopicForm {
    subjectId: FormControl<number | null | undefined>;
    parentId: FormControl<number | null | undefined>;
    titleUz: FormControl<string | null>;
    titleRu: FormControl<string | null>;
}