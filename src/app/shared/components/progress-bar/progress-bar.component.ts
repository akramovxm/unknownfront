import {Component, input} from '@angular/core';
import {MatProgressBar, ProgressBarMode} from "@angular/material/progress-bar";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-progress-bar',
    imports: [
        MatProgressBar,
        NgIf
    ],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
    loading = input.required<boolean>();
    mode = input<ProgressBarMode>('indeterminate');
}
