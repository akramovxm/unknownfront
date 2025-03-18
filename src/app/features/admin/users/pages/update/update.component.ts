import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {NgForOf} from "@angular/common";
import {UserFormComponent} from "@features/admin/users/components/user-form/user-form.component";
import {UserSelectionService} from "@features/admin/users/services/user-selection.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserForm} from "@features/admin/users/models/user-form";
import {ContainerComponent} from "@components/container/container.component";
import {AdminUser} from "@features/admin/users/models/admin-user";
import {UserStateService} from "@features/admin/users/services/user-state.service";

@Component({
    selector: 'app-update',
    imports: [
        MatTabGroup,
        MatTab,
        NgForOf,
        UserFormComponent,
        ContainerComponent,
    ],
    templateUrl: './update.component.html',
    styleUrl: './update.component.scss'
})
export class UpdateComponent implements OnInit, OnDestroy {
    private readonly formBuilder = inject(FormBuilder);
    private readonly userStateService = inject(UserStateService);
    private readonly userSelectionService = inject(UserSelectionService);

    forms: FormGroup<UserForm>[] = []

    ngOnInit() {
        this.forms = this.users.map(user => this.createForm(user));
    }
    ngOnDestroy() {
        this.userSelectionService.removeFromLocalStorage();
    }

    onSubmit(id?: number | null) {
        if (id) {
            const form = this.forms.find(form =>
                form.controls['id'].value === id);

            if (form) {
                this.userStateService.updateUser(form, id);
            }
        }
    }

    getLabel(id: number | null) {
        const user = this.users.find(user => user.id === id);
        if (user) {
            return user.email + ' (' + user.firstName + ')'
        }
        return '';
    }

    private createForm(user: AdminUser) {
        return this.formBuilder.group({
            id: this.formBuilder.control<number | null>(user.id),
            firstName: this.formBuilder.control<string | null>(user.firstName, Validators.required),
            lastName: this.formBuilder.control<string | null>(user.lastName, Validators.required),
            email: this.formBuilder.control<string | null>(user.email, [Validators.required, Validators.email]),
            phoneNumber: this.formBuilder.control<string | null>(user.phoneNumber),
            birthDate: this.formBuilder.control<string | null>(user.birthDate),
            role: this.formBuilder.control<string | null>(user.role, Validators.required),
            locked: this.formBuilder.control<boolean | null>(user.locked),
        });
    }

    get users() {
        return this.userSelectionService.getFromLocalStorage();
    }
}
