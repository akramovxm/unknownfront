import {inject, Injectable, signal} from '@angular/core';
import {MeService} from "@features/admin/settings/services/me.service";
import {FormGroup} from "@angular/forms";
import {ErrorService} from "@services/error.service";
import {User} from "@models/user";
import {SnackbarService} from "@services/snackbar.service";
import {SettingsForm} from "@features/admin/settings/models/settings-form";
import {UpdatePasswordForm} from "@features/admin/settings/models/update-password-form";

@Injectable({
    providedIn: 'root'
})
export class MeStateService {
    private readonly meService = inject(MeService);
    private readonly errorService = inject(ErrorService);
    private readonly snackbarService = inject(SnackbarService);

    readonly loading = signal<boolean>(false);
    readonly meLoading = signal<boolean>(false);

    getMe(form: FormGroup<SettingsForm>) {
        this.meLoading.set(true);
        form.disable();
        this.meService.getMe().subscribe({
            next: res => {
                this.meLoading.set(false);
                form.enable();
                this.setFormValues(form, res.data);
            },
            error: err => {
                this.meLoading.set(false);
                form.enable();
                this.errorService.onError(err);
            }
        })
    }

    updateMe(form: FormGroup<SettingsForm>) {
        if (form.invalid) return;

        this.loading.set(true);
        form.disable();

        this.meService.updateMe(form.value)
            .subscribe({
                next: res => {
                    this.loading.set(false);
                    form.enable();
                    this.snackbarService.open('USER_UPDATED_SUCCESS');
                },
                error: err => {
                    this.loading.set(false);
                    form.enable();
                    this.errorService.onError(err, form, ['exists']);
                }
            });
    }

    updatePassword(form: FormGroup<UpdatePasswordForm>) {
        if (form.invalid) return;

        this.loading.set(true);
        form.disable();

        this.meService.updatePassword(form.value).subscribe({
            next: res => {
                this.loading.set(false);
                form.enable();
                this.snackbarService.open('PASSWORD_UPDATED_SUCCESS');
            },
            error: err => {
                this.loading.set(false);
                form.enable();
                this.errorService.onError(err, form, ['incorrect']);
            }
        });
    }

    private setFormValues(form: FormGroup<SettingsForm>, user: User) {
        form.controls.firstName.setValue(user.firstName);
        form.controls.lastName.setValue(user.lastName);
        form.controls.phoneNumber.setValue(user.phoneNumber);
        form.controls.birthDate.setValue(user.birthDate);
    }
}
