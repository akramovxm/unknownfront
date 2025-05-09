import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {ContainerComponent} from "@shared/components/container/container.component";
import {UserFormComponent} from "@features/admin/users/components/user-form/user-form.component";
import {UserForm} from "@features/admin/users/models/user-form";
import {UserStateService} from "@features/admin/users/services/user-state.service";
import {SimpleToolbarComponent} from "@shared/components/simple-toolbar/simple-toolbar.component";

@Component({
    selector: 'app-user-create',
    imports: [
        FormsModule,
        NgxTrimDirectiveModule,
        ReactiveFormsModule,
        ContainerComponent,
        UserFormComponent,
        SimpleToolbarComponent
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'en'},
        provideNativeDateAdapter()
    ],
    templateUrl: './user-create.component.html',
    styleUrl: './user-create.component.scss'
})
export class UserCreateComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly userStateService = inject(UserStateService);

    readonly form = this.formBuilder.group<UserForm>({
        id: this.formBuilder.control<number | null>(null),
        firstName: this.formBuilder.control<string | null>(null, Validators.required),
        lastName: this.formBuilder.control<string | null>(null, Validators.required),
        email: this.formBuilder.control<string | null>(null, [Validators.required, Validators.email]),
        phoneNumber: this.formBuilder.control<string | null>(null),
        birthDate: this.formBuilder.control<string | null>(null),
        role: this.formBuilder.control<string | null>(null, Validators.required),
        locked: this.formBuilder.control<boolean | null>(false)
    });

    onSubmit() {
        this.userStateService.create(this.form);
    }
}
