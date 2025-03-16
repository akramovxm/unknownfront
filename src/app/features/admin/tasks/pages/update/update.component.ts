import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TaskSelectionService} from "@features/admin/tasks/services/task-selection.service";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {NgForOf} from "@angular/common";
import {TaskFormComponent} from "@features/admin/tasks/components/task-form/task-form.component";
import {ContainerComponent} from "@components/container/container.component";
import {AnswerForm, TaskForm} from "@features/admin/tasks/models/task-form";
import {FormBuilder, FormGroup} from "@angular/forms";
import {oneCorrectValidator} from "@validators/one-correct.validator";
import {MathjaxService} from "@services/mathjax.service";
import {TaskStateService} from "@features/admin/tasks/services/task-state.service";
import {AdminTask} from "@features/admin/tasks/models/admin-task";

@Component({
    selector: 'app-update',
    imports: [
        MatTab,
        MatTabGroup,
        NgForOf,
        TaskFormComponent,
        ContainerComponent
    ],
    templateUrl: './update.component.html',
    styleUrl: './update.component.scss'
})
export class UpdateComponent implements OnInit, OnDestroy {
    private readonly formBuilder = inject(FormBuilder);
    private readonly taskStateService = inject(TaskStateService);
    private readonly taskSelectionService = inject(TaskSelectionService);
    private readonly mathjaxService = inject(MathjaxService);

    forms: FormGroup<TaskForm>[] = [];

    ngOnInit() {
        this.forms = this.tasks.map(task => this.createForm(task));
    }
    ngOnDestroy() {
        this.taskSelectionService.removeFromLocalStorage();
    }

    onSubmit(id?: number | null) {
        if (id) {
            const form = this.forms.find(form =>
                form.controls['id'].value === id);
            if (form) {
                this.taskStateService.updateTask(form, id);
            }
        }
    }

    onIndexChange(i: number) {
        this.mathjaxService.renderMath();
    }

    private createForm(task: AdminTask) {
        const answers = task.answers.map(answer => {
            return this.formBuilder.group<AnswerForm>({
                id: this.formBuilder.control<number | null>(answer.id),
                valueUz: this.formBuilder.control<string | null>(answer.valueUz),
                valueRu: this.formBuilder.control<string | null>(answer.valueRu),
                correct: this.formBuilder.control<boolean | null>(answer.correct),
            })
        })
        return this.formBuilder.group<TaskForm>({
            id: this.formBuilder.control<number | null>(task.id),
            topicId: this.formBuilder.control<number | null>(null),
            sourceId: this.formBuilder.control<number | null>(null),
            level: this.formBuilder.control<string | null>(task.level),
            type: this.formBuilder.control<string | null>(task.type),
            contentUz: this.formBuilder.control<string | null>(task.contentUz),
            contentRu: this.formBuilder.control<string | null>(task.contentRu),
            answers: this.formBuilder.array(answers, {validators: oneCorrectValidator()})
        });
    }

    get tasks() {
        return this.taskSelectionService.getFromLocalStorage();
    }
}
