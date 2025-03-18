import { FormControl } from "@angular/forms";

export interface TopicForm {
    titleUz: FormControl<string | null>;
    titleRu: FormControl<string | null>;
    parentId: FormControl<number | null | undefined>;
}