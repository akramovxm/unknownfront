import {Component, ElementRef, inject, OnInit, signal, viewChild} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf, NgStyle} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {
    ButtonProgressSpinnerComponent
} from "@shared/components/button-progress-spinner/button-progress-spinner.component";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SubjectStateService} from "@features/profile/subjects/services/subject-state.service";
import {Subject} from "@features/profile/subjects/models/subject";
import {ErrorMessageService} from "@services/error-message.service";
import {TestStartForm} from "@features/profile/test/models/test-start-form";
import {TestStateService} from "@features/profile/test/services/test-state.service";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {finalize} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector: 'app-test-start-form-dialog',
    imports: [
        MatDialogTitle,
        TranslatePipe,
        MatDialogContent,
        FormsModule,
        MatError,
        MatFormField,
        MatInput,
        MatLabel,
        NgIf,
        ReactiveFormsModule,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        ButtonProgressSpinnerComponent,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatOption,
        MatProgressSpinner,
        MatSuffix,
        MatRadioButton,
        MatRadioGroup,
        NgStyle
    ],
    templateUrl: './test-start-form-dialog.component.html',
    styleUrl: './test-start-form-dialog.component.scss'
})
export class TestStartFormDialogComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly formBuilder = inject(FormBuilder);
    private readonly subjectStateService = inject(SubjectStateService);
    private readonly testStateService = inject(TestStateService);
    private readonly translate = inject(TranslateService);
    private readonly errorMessageService = inject(ErrorMessageService);

    readonly firstSubjectInput = viewChild<ElementRef<HTMLInputElement>>('firstSubjectInput');
    readonly secondSubjectInput = viewChild<ElementRef<HTMLInputElement>>('secondSubjectInput');

    readonly filteredFirstSubjects = signal<Subject[]>([]);
    readonly filteredSecondSubjects = signal<Subject[]>([]);

    readonly form = this.formBuilder.group<TestStartForm>({
        firstSubjectId: this.formBuilder.control(null, [Validators.required]),
        secondSubjectId: this.formBuilder.control(null),
        language: this.formBuilder.control(null, [Validators.required])
    });

    ngOnInit() {
        this.subjectStateService.getSubjects().subscribe();
    }

    onSubmit() {
        this.form.disable();
        this.testStateService.start(this.form).pipe(
            finalize(() => this.form.enable())
        ).subscribe(res => {
            this.router.navigate(['/profile/test']);
        });
    }

    filterFirstSubjects() {
        const filterValue = this.firstSubjectInput()?.nativeElement.value.toLowerCase();
        if (filterValue) {
            const filtered = this.subjects().filter(t =>
                t.titleUz.toLowerCase().includes(filterValue) || t.titleRu.toLowerCase().includes(filterValue)
            );
            this.filteredFirstSubjects.set(filtered);
        }
    }

    filterSecondSubjects() {
        const filterValue = this.secondSubjectInput()?.nativeElement.value.toLowerCase();
        if (filterValue) {
            const filtered = this.subjects().filter(t =>
                t.titleUz.toLowerCase().includes(filterValue) || t.titleRu.toLowerCase().includes(filterValue)
            );
            this.filteredSecondSubjects.set(filtered);
        }
    }

    subjectDisplayFn(id: number | null): string {
        const option = this.subjects().find(item => item.id === Number(id));
        if (option) {
            if (this.translate.currentLang === 'uz') {
                return option.titleUz;
            } else {
                return option.titleRu;
            }
        }
        return '';
    }

    getSubjectTitle(subject: Subject) {
        if (this.translate.currentLang === 'uz') {
            return subject.titleUz;
        }
        return subject.titleRu;
    }

    get subjects() {
        return this.subjectStateService.subjects;
    }
    get loading() {
        return this.testStateService.loading;
    }
    get subjectLoading() {
        return this.subjectStateService.loading;
    }
    get submitted() {
        return this.testStateService.submitted;
    }
    get subjectError() {
        return this.errorMessageService.getMessage(
            this.form.controls.firstSubjectId,
            {error: 'required', message: 'SUBJECT_REQUIRED'}
        );
    }
    get languageError() {
        return this.errorMessageService.getMessage(
            this.form.controls.language,
            {error: 'required', message: 'LANGUAGE_REQUIRED'}
        );
    }
}
