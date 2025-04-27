import {Component, inject, OnInit} from '@angular/core';
import {SimpleToolbarComponent} from "@shared/components/simple-toolbar/simple-toolbar.component";
import {TranslatePipe} from "@ngx-translate/core";
import {ProgressBarComponent} from "@shared/components/progress-bar/progress-bar.component";
import {MyTestsStateService} from "@features/profile/my-tests/services/my-tests-state.service";
import {ContainerComponent} from "@shared/components/container/container.component";
import {TestCardComponent} from "@features/profile/my-tests/components/test-card/test-card.component";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'app-my-tests-main',
    imports: [
        SimpleToolbarComponent,
        TranslatePipe,
        ProgressBarComponent,
        ContainerComponent,
        TestCardComponent,
        NgForOf
    ],
    templateUrl: './my-tests-main.component.html',
    styleUrl: './my-tests-main.component.scss'
})
export class MyTestsMainComponent implements OnInit {
    private readonly myTestsStateService = inject(MyTestsStateService);

    ngOnInit() {
        this.myTestsStateService.getAllTestsCurrentUser().subscribe();
    }

    get loading() {
        return this.myTestsStateService.loading;
    }
    get tests() {
        return this.myTestsStateService.tests;
    }
}
