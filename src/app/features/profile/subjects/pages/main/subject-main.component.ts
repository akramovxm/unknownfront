import {Component, inject, OnInit} from '@angular/core';
import {ContainerComponent} from "@shared/components/container/container.component";
import {NgForOf} from "@angular/common";
import {ProgressBarComponent} from "@shared/components/progress-bar/progress-bar.component";
import {SimpleToolbarComponent} from "@shared/components/simple-toolbar/simple-toolbar.component";
import {SubjectCardComponent} from "@features/profile/subjects/components/subject-card/subject-card.component";
import {SubjectStateService} from "@features/profile/subjects/services/subject-state.service";

@Component({
    selector: 'app-profile-subjects-main',
    imports: [
        ContainerComponent,
        NgForOf,
        ProgressBarComponent,
        SimpleToolbarComponent,
        SubjectCardComponent,
    ],
    templateUrl: './subject-main.component.html',
    styleUrl: './subject-main.component.scss'
})
export class SubjectMainComponent implements OnInit {
    private readonly subjectStateService = inject(SubjectStateService);

    ngOnInit() {
        this.subjectStateService.getSubjects().subscribe();
    }

    get loading() {
        return this.subjectStateService.loading;
    }
    get subjects() {
        return this.subjectStateService.subjects;
    }
}
