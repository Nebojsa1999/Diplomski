import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { shared } from "../../../../../app.config";

export interface FilterDepartmentParam {
    name: string;
    hospital: number | null;
}

@Component({
    selector: 'app-filter-departments',
    imports: [shared],
    templateUrl: './filter-departments.component.html',
    styleUrl: './filter-departments.component.scss',
})
export class FilterDepartmentsComponent {
    form: FormGroup;
    @Output() searchClicked = new EventEmitter<FilterDepartmentParam>();

    constructor(fb: FormBuilder) {
        this.form = fb.group({
            name: new FormControl<string>('', [Validators.maxLength(255)]),
        });
    }

    applyFilter() {
        this.searchClicked.emit({
            name: this.form.get('name')?.value,
            hospital: null
        });
    }

    resetFilter() {
        this.form.get('name')?.reset();
        this.searchClicked.emit({ name: '', hospital: null });
        this.form.markAsPristine();
    }
}
