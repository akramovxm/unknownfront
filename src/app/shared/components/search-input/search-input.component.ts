import {Component, inject, input, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {TranslatePipe} from "@ngx-translate/core";
import {debounceTime, distinctUntilChanged, filter} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-search-input',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormField,
        MatIcon,
        MatIconButton,
        MatInput,
        MatSuffix,
        NgIf,
        NgxTrimDirectiveModule,
        TranslatePipe
    ],
    templateUrl: './search-input.component.html',
    styleUrl: './search-input.component.scss'
})
export class SearchInputComponent implements OnInit {
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);

    search = input.required<FormControl<string | null>>();

    clear(e: MouseEvent) {
        e.stopPropagation();
        this.search().setValue('');
    }

    ngOnInit() {
        this.search().valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            filter((value): value is string => value !== null)
        ).subscribe(value => {
            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: { search: value }
            });
        })
    }
}
