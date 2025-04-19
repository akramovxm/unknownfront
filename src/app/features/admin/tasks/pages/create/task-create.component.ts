import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {TaskFormComponent} from "@features/admin/tasks/components/task-form/task-form.component";
import {ContainerComponent} from "@shared/components/container/container.component";
import {oneCorrectValidator} from "@validators/one-correct.validator";
import {AnswerForm, TaskForm} from "@features/admin/tasks/models/task-form";
import {TaskStateService} from "@features/admin/tasks/services/task-state.service";
import {SimpleToolbarComponent} from "@shared/components/simple-toolbar/simple-toolbar.component";
import {
    TaskCreateActionsComponent
} from "@features/admin/tasks/components/task-create-actions/task-create-actions.component";

@Component({
    selector: 'app-task-create',
    imports: [
        ReactiveFormsModule,
        NgxTrimDirectiveModule,
        TaskFormComponent,
        ContainerComponent,
        SimpleToolbarComponent,
        TaskCreateActionsComponent
    ],
    templateUrl: './task-create.component.html',
    styleUrl: './task-create.component.scss'
})
export class TaskCreateComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly taskStateService = inject(TaskStateService);

    readonly form = this.formBuilder.group<TaskForm>({
        id: this.formBuilder.control<number | null>(null),
        subjectId: this.formBuilder.control<number | null>(null, Validators.required),
        topicId: this.formBuilder.control<number | null>(null),
        sourceId: this.formBuilder.control<number | null>(null),
        level: this.formBuilder.control<string | null>(null, Validators.required),
        type: this.formBuilder.control<string | null>(null, Validators.required),
        rowAnswers: this.formBuilder.control<boolean | null>(false),
        contentUz: this.formBuilder.control<string | null>(null, Validators.required),
        contentRu: this.formBuilder.control<string | null>(null, Validators.required),
        answers: this.formBuilder.array([
            this.formBuilder.group<AnswerForm>({
                id: this.formBuilder.control<number | null>(null),
                valueUz: this.formBuilder.control<string | null>(null, Validators.required),
                valueRu: this.formBuilder.control<string | null>(null, Validators.required),
                correct: this.formBuilder.control<boolean | null>(false, Validators.required),
            }),
            this.formBuilder.group<AnswerForm>({
                id: this.formBuilder.control<number | null>(null),
                valueUz: this.formBuilder.control<string | null>(null, Validators.required),
                valueRu: this.formBuilder.control<string | null>(null, Validators.required),
                correct: this.formBuilder.control<boolean | null>(false, Validators.required),
            }),
            this.formBuilder.group<AnswerForm>({
                id: this.formBuilder.control<number | null>(null),
                valueUz: this.formBuilder.control<string | null>(null, Validators.required),
                valueRu: this.formBuilder.control<string | null>(null, Validators.required),
                correct: this.formBuilder.control<boolean | null>(false, Validators.required),
            }),
            this.formBuilder.group<AnswerForm>({
                id: this.formBuilder.control<number | null>(null),
                valueUz: this.formBuilder.control<string | null>(null, Validators.required),
                valueRu: this.formBuilder.control<string | null>(null, Validators.required),
                correct: this.formBuilder.control<boolean | null>(false, Validators.required),
            })
        ], {validators: oneCorrectValidator()})
    });

    onSubmit() {
        this.taskStateService.createTask(this.form);
    }
}
