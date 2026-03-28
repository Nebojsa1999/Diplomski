import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { shared } from "../../../../../app.config";

export interface FilterProcedureParam {
    name: string;
    department: number | null;
}

@Component({
    selector: 'app-filter-procedures',
    imports: [shared],
    templateUrl: './filter-procedures.component.html',
    styleUrl: './filter-procedures.component.scss',
})
export class FilterProceduresComponent {
    form: FormGroup;
    @Output() searchClicked = new EventEmitter<FilterProcedureParam>();

    constructor(fb: FormBuilder) {
        this.form = fb.group({
            name: new FormControl<string>('', [Validators.maxLength(255)]),
        });
    }

    applyFilter() {
        this.searchClicked.emit({
            name: this.form.get('name')?.value,
            department: null
        });
    }

    resetFilter() {
        this.form.get('name')?.reset();
        this.searchClicked.emit({ name: '', department: null });
        this.form.markAsPristine();
    }
}
