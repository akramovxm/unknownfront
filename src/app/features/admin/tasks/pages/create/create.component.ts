import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {TaskFormComponent} from "@features/admin/tasks/components/task-form/task-form.component";
import {ContainerComponent} from "@components/container/container.component";
import {oneCorrectValidator} from "@validators/one-correct.validator";
import {AnswerForm, TaskForm} from "@features/admin/tasks/models/task-form";
import {TaskStateService} from "@features/admin/tasks/services/task-state.service";

@Component({
    selector: 'app-create',
    imports: [
        ReactiveFormsModule,
        NgxTrimDirectiveModule,
        TaskFormComponent,
        ContainerComponent
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss'
})
export class CreateComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly taskStateService = inject(TaskStateService);

    readonly form = this.formBuilder.group<TaskForm>({
        id: this.formBuilder.control<number | null>(null),
        topicId: this.formBuilder.control<number | null>(null),
        sourceId: this.formBuilder.control<number | null>(null),
        level: this.formBuilder.control<string | null>(null, Validators.required),
        type: this.formBuilder.control<string | null>(null, Validators.required),
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
