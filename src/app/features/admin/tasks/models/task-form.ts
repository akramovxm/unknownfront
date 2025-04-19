import {FormArray, FormControl, FormGroup} from "@angular/forms";

export interface TaskForm {
    id: FormControl<number | null>;
    subjectId: FormControl<number | string | null>;
    topicId: FormControl<number | string | null>;
    sourceId: FormControl<number | string | null>;
    level: FormControl<string | null>;
    type: FormControl<string | null>;
    rowAnswers: FormControl<boolean | null>;
    contentUz: FormControl<string | null>;
    contentRu: FormControl<string | null>;
    answers: FormArray<FormGroup<AnswerForm>>
}

export interface AnswerForm {
    id: FormControl<number | null>;
    valueUz: FormControl<string | null>;
    valueRu: FormControl<string | null>;
    correct: FormControl<boolean | null>;
}