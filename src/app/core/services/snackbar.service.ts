import {inject, Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    translate = inject(TranslateService);
    snackbar = inject(MatSnackBar);

    open(key: string) {
        this.translate.get([key, 'CLOSE']).subscribe(messages => {
            this.snackbar.open(messages[key], messages['CLOSE'], { duration: 5000 });
        });
    }
}
