import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';

export function oneCorrectValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!(control instanceof FormArray)) {
            return null;
        }

        const correctAnswers = control.controls.filter(
            (group) => group.get('correct')?.value === true
        );

        return correctAnswers.length === 1 ? null : { oneCorrect: true };
    };
}
