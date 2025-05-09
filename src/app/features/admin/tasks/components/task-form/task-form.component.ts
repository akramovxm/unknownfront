import {Component, DestroyRef, ElementRef, inject, input, OnInit, signal, viewChild} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {AdminTopic} from "@features/admin/topics/models/admin-topic";
import {AdminSource} from "@models/admin-source";
import {
    TopicSelectDialogComponent
} from "@features/admin/topics/components/topic-select-dialog/topic-select-dialog.component";
import {TaskPreviewCardComponent} from "@features/admin/tasks/components/task-preview-card/task-preview-card.component";
import {TaskForm} from "@features/admin/tasks/models/task-form";
import {TaskStateService} from "@features/admin/tasks/services/task-state.service";
import {TopicStateService} from "@features/admin/topics/services/topic-state.service";
import {SourceStateService} from "@services/source-state.service";
import {ErrorMessageService} from "@services/error-message.service";
import {TaskSelectionService} from "@features/admin/tasks/services/task-selection.service";
import {
    ButtonProgressSpinnerComponent
} from "@shared/components/button-progress-spinner/button-progress-spinner.component";
import {AdminAnswer} from "@features/admin/tasks/models/admin-task";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {SubjectStateService} from "@features/admin/subjects/services/subject-state.service";
import {AdminSubject} from "@features/admin/subjects/models/admin-subject";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-task-form',
    imports: [
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatButton,
        MatError,
        MatFormField,
        MatIcon,
        MatIconButton,
        MatInput,
        MatLabel,
        MatOption,
        MatProgressSpinner,
        MatRadioButton,
        MatRadioGroup,
        MatSuffix,
        NgForOf,
        NgIf,
        NgxTrimDirectiveModule,
        ReactiveFormsModule,
        TranslatePipe,
        NgStyle,
        TaskPreviewCardComponent,
        ButtonProgressSpinnerComponent,
        MatSlideToggle
    ],
    templateUrl: './task-form.component.html',
    styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly subjectStateService = inject(SubjectStateService);
    private readonly topicStateService = inject(TopicStateService);
    private readonly sourceStateService = inject(SourceStateService);
    private readonly taskStateService = inject(TaskStateService);
    private readonly taskSelectionService = inject(TaskSelectionService);
    private readonly errorMessageService = inject(ErrorMessageService);
    private readonly dialog = inject(MatDialog);
    private readonly translate = inject(TranslateService);

    private destroyRef = inject(DestroyRef);

    readonly form = input.required<FormGroup<TaskForm>>();
    readonly icon = input.required<string>();
    readonly action = input.required<string>();
    readonly submit = input.required<(id?: number | null) => void>();

    readonly subjectInput = viewChild<ElementRef<HTMLInputElement>>('subjectInput');
    readonly topicInput = viewChild<ElementRef<HTMLInputElement>>('topicInput');
    readonly sourceInput = viewChild<ElementRef<HTMLInputElement>>('sourceInput');

    readonly ruFocus = signal<boolean>(false);
    readonly filteredSubjects = signal<AdminSubject[]>([]);
    readonly filteredTopics = signal<AdminTopic[]>([]);
    readonly filteredSources = signal<AdminSource[]>([]);

    ngOnInit() {
        if (this.translate.currentLang === 'ru') {
            this.ruFocus.set(true);
        }

        this.subjectStateService.getSubjects().subscribe(subjects => {
            this.setSubjectId(subjects);

            const subjectId = this.activatedRoute.snapshot.paramMap.get('subjectId');

            if (subjectId) {
                this.form().controls.subjectId.setValue(subjectId);
            }
        })

        this.form().controls.subjectId.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(v => {
                this.filteredTopics.set([]);
                this.topicStateService.getTopicsBySubjectId(Number(v))
                    .subscribe(topics => this.setTopicId(topics));
            })
        this.sourceStateService.getSources().subscribe(sources => {
            this.setSourceId(sources);
        });
    }

    onSubmit() {
        if (this.form().controls.id.value) {
            this.submit()(this.form().controls.id.value);
        } else {
            this.submit()();
        }
    }

    onUzFocus() {
        this.ruFocus.set(false);
    }

    onRuFocus() {
        this.ruFocus.set(true);
    }

    onTreeClick(e: MouseEvent) {
        e.stopPropagation();
        const subjectId = Number(this.form().controls.subjectId.value)
        this.topicStateService.getTreeTopicsBySubjectId(subjectId)
            .subscribe(res => this.onSuccess());
    }

    onAddSourceClick(e: MouseEvent) {
        e.stopPropagation();
        const name = this.sourceInput()?.nativeElement.value;
        if (name) {
            this.sourceStateService.createSource(name).subscribe(res => {
                if (res.data) {
                    this.filteredSources.update(sources => [res.data, ...sources]);
                }
            });
        }
    }

    onCorrectClick(e: MouseEvent, i: number) {
        e.stopPropagation();
        this.form().controls.answers.controls.forEach((control, index) => {
            if (i === index) {
                control.controls.correct.setValue(true);
            } else {
                control.controls.correct.setValue(false);
            }
        })
    }

    subjectDisplayFn(id: number | null): string {
        const option = this.subjects.find(item => item.id === Number(id));
        if (option) {
            if (this.translate.currentLang === 'uz') {
                return option.titleUz;
            } else {
                return option.titleRu;
            }
        }
        return '';
    }

    topicDisplayFn(id: number | null): string {
        const option = this.topics.find(item => item.id === Number(id));
        if (option) {
            if (this.translate.currentLang === 'uz') {
                return option.titleUz;
            } else {
                return option.titleRu;
            }
        }
        return '';
    }

    sourceDisplayFn(id: number | null): string {
        const option = this.sources.find(item => item.id === Number(id));
        return option ? option.name : '';
    }

    filterSubjects() {
        const filterValue = this.subjectInput()?.nativeElement.value.toLowerCase();
        if (filterValue) {
            const filtered = this.subjects.filter(t =>
                t.titleUz.toLowerCase().includes(filterValue) || t.titleRu.toLowerCase().includes(filterValue)
            );
            this.filteredSubjects.set(filtered);
        }
    }

    filterTopics() {
        const filterValue = this.topicInput()?.nativeElement.value.toLowerCase();
        if (filterValue) {
            const filtered = this.topics.filter(t =>
                t.titleUz.toLowerCase().includes(filterValue) || t.titleRu.toLowerCase().includes(filterValue)
            );
            this.filteredTopics.set(filtered);
        }
    }

    filterSources() {
        const filterValue = this.sourceInput()?.nativeElement.value.toLowerCase();
        if (filterValue) {
            const filtered = this.sources.filter(s =>
                s.name.toLowerCase().includes(filterValue)
            );
            this.filteredSources.set(filtered);
        }
    }

    private onSuccess() {
        let dialogRef = this.dialog.open(TopicSelectDialogComponent);
        dialogRef.afterClosed().subscribe((id: number) => {
            if (id) {
                this.form().controls.topicId.setValue(id);
            }
        })
    }

    private setSubjectId(subjects: AdminSubject[]) {
        if (subjects.length) {
            this.tasks.forEach(task => {
                if (task.subject) {
                    this.form().controls.subjectId.setValue(task.subject.id);
                }
            })
        }
    }

    private setTopicId(topics: AdminTopic[]) {
        if (topics.length) {
            this.tasks.forEach(task => {
                if (task.topic) {
                    this.form().controls.topicId.setValue(task.topic.id);
                }
            })
        }
    }

    private setSourceId(sources: AdminSource[]) {
        if (sources.length) {
            this.tasks.forEach(task => {
                if (task.source) {
                    this.form().controls.sourceId.setValue(task.source.id);
                    this.filteredSources.set([task.source]);
                }
            })
        }
    }

    getSubjectTitle(subject: AdminSubject) {
        if (this.translate.currentLang === 'uz') {
            return subject.titleUz;
        }
        return subject.titleRu;
    }

    getTopicTitle(topic: AdminTopic) {
        if (this.translate.currentLang === 'uz') {
            return topic.titleUz;
        }
        return topic.titleRu;
    }

    get cardContent() {
        return this.ruFocus() ? this.form().controls['contentRu'].value
            : this.form().controls['contentUz'].value;
    }

    get cardAnswers() {
        return this.form().controls.answers.value as AdminAnswer[];
    }

    get loading() {
        return this.taskStateService.loading();
    }

    get subjectLoading() {
        return this.subjectStateService.loading();
    }

    get topicLoading() {
        return this.topicStateService.loading();
    }

    get topicTreeLoading() {
        return this.topicStateService.treeLoading();
    }

    get sourceLoading() {
        return this.sourceStateService.loading();
    }

    get submitted() {
        return this.taskStateService.submitted();
    }

    get subjects() {
        return this.subjectStateService.subjects();
    }

    get topics() {
        return this.topicStateService.topics();
    }

    get sources() {
        return this.sourceStateService.sources();
    }

    get tasks() {
        return this.taskSelectionService.getFromLocalStorage();
    }

    get disabled() {
        const source = this.filteredSources().find(s =>
            s.name.toLowerCase() === this.sourceInput()?.nativeElement.value.toLowerCase()
        )
        if (!this.sourceInput()?.nativeElement.value.length) {
            return true;
        }
        return source;
    }

    get treeDisabled() {
        return !this.form().controls.subjectId.value;
    }

    get subjectError() {
        return this.errorMessageService.getMessage(
            this.form().controls.subjectId,
            {error: 'required', message: 'SUBJECT_REQUIRED'}
        );
    }

    get levelError() {
        return this.errorMessageService.getMessage(
            this.form().controls.level,
            {error: 'required', message: 'LEVEL_REQUIRED'}
        );
    }

    get typeError() {
        return this.errorMessageService.getMessage(
            this.form().controls.type,
            {error: 'required', message: 'LEVEL_REQUIRED'}
        );
    }

    get contentUzError() {
        return this.errorMessageService.getMessage(
            this.form().controls.contentUz,
            [
                {error: 'required', message: 'CONTENT_REQUIRED'},
                {error: 'exists', message: 'CONTENT_EXISTS'}
            ]
        );
    }

    get contentRuError() {
        return this.errorMessageService.getMessage(
            this.form().controls.contentRu,
            [
                {error: 'required', message: 'CONTENT_REQUIRED'},
                {error: 'exists', message: 'CONTENT_EXISTS'}
            ]
        );
    }

    get correctError() {
        return this.errorMessageService.getMessage(
            this.form().controls.answers,
            {error: 'oneCorrect', message: 'ONE_CORRECT'}
        );
    }

    getValueUzError(i: number) {
        return this.errorMessageService.getMessage(
            this.form().controls.answers.controls[i].controls.valueUz,
            {error: 'required', message: 'ANSWER_REQUIRED'}
        );
    }

    getValueRuError(i: number) {
        return this.errorMessageService.getMessage(
            this.form().controls.answers.controls[i].controls.valueRu,
            {error: 'required', message: 'ANSWER_REQUIRED'}
        );
    }
}
