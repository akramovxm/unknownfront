import {inject, Injectable} from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class ErrorMessageService {
    private readonly translate = inject(TranslateService);

    getMessage(
        control: FormControl<any> | FormArray<FormGroup>,
        fields: {error: string, message: string}[] | {error: string, message: string}) {
        const errors = control.errors;
        let error = '';
        if (Array.isArray(fields)) {
            fields.forEach(field => {
                if (errors?.[field.error]) {
                    error = this.translate.instant(field.message);
                }
            })
        } else {
            if (errors?.[fields.error]) {
                error = this.translate.instant(fields.message);
            }
        }
        return error;
    }
}
