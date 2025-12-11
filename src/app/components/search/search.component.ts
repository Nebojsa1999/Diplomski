import { Component, effect } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../common/service/api.service';
import { shared } from "../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../common/service/authentication.service";

export const ROUTE_SEARCH = 'search';

@Component({
    selector: 'app-search',
    imports: [shared],
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {

    user: any;
    form: UntypedFormGroup;
    centerAccounts: any;
    displayedColumns: string[] = ['Name', 'Description', 'Address', 'City', 'Country'];
    public hideElement: boolean = false;
    currentUser = toSignal(this.authService.activeUser);

    toggleElement() {
        this.hideElement = true;
    }

    constructor(
        private router: Router,
        private authService: AuthenticationService,
        private fb: UntypedFormBuilder,
        private api: ApiService) {
        effect(() => {
            const currentUser = this.currentUser();
        });

        this.form = this.fb.group({
            centerName: ['']
        });

    }

    async onSubmit(): Promise<void> {
        const centerName = this.form.get('centerName')?.value;
        this.api.centerAccountApi.searchCenter({
            centerName: centerName

        }).subscribe((response: any) => {
            this.centerAccounts = response;

        })
    }
}
