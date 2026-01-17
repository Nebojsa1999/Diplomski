import { Component, EventEmitter, Output } from '@angular/core';
import { shared } from "../../../../../app.config";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../../../common/service/api.service";
import { map } from "rxjs/operators";
import { catchError, of } from "rxjs";

export interface FilterUserParam {
    name: string;
    hospital: number | null
}

@Component({
    selector: 'app-filter-user',
    imports: [shared],
    templateUrl: './filter-user.component.html',
    styleUrl: './filter-user.component.scss',
})
export class FilterUserComponent {
    form: FormGroup;
    @Output() searchClicked = new EventEmitter<FilterUserParam>();
    hospitals$ = this.apiService.hospitalApi.list().pipe(
        map(response => response.data),
        catchError(error => of([]))
    )

    constructor(fb: FormBuilder, private apiService: ApiService) {
        this.form = fb.group({
            name: new FormControl<string>('', [Validators.maxLength(255)]),
            hospital: new FormControl<number | null>(null)
        })

        this.form.get('hospital')?.setValue('');
    }

    applyFilter() {
        this.searchClicked.emit({
                name: this.form.get('name')?.value,
                hospital: this.form.get('hospital')?.value
            }
        )
    }

    resetFilter() {
        this.form.get('name')?.reset();
        this.form.get('hospital')?.setValue('');
        this.searchClicked.emit({name: '', hospital: null})
        this.form.markAsPristine();
    }
}
