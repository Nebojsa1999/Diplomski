import { Component, EventEmitter, Output } from '@angular/core';
import { shared } from "../../../../../app.config";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

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

    constructor(fb: FormBuilder) {
        this.form = fb.group({
            name: new FormControl<string>('', [Validators.maxLength(255)]),
        });
    }

    applyFilter() {
        this.searchClicked.emit({ name: this.form.get('name')?.value, hospital: null });
    }

    resetFilter() {
        this.form.get('name')?.reset();
        this.searchClicked.emit({ name: '', hospital: null });
        this.form.markAsPristine();
    }
}
