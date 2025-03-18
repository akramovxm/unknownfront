import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "@services/auth.service";
import {SnackbarService} from "@services/snackbar.service";

@Component({
    selector: 'app-oauth2-redirect',
    standalone: true,
    imports: [],
    templateUrl: './oauth2-redirect.component.html',
    styleUrl: './oauth2-redirect.component.css'
})
export class Oauth2RedirectComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    private readonly snackbarService = inject(SnackbarService);

    ngOnInit() {
        this.route.queryParams.subscribe(value => {
            const token = value['token'];
            const error = value['error'];
            if (token) {
                this.authService.onLoginSuccess(token);
            } else if (error) {
                this.snackbarService.open(error);
                this.router.navigate(['/'])
            } else {
                this.router.navigate(['/'])
            }
        });
    }
}
