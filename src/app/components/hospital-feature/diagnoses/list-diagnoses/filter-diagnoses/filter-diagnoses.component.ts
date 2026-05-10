import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { shared } from "../../../../../app.config";

export interface FilterDiagnosisParam {
    name: string;
    departmentName: string | null;
}

@Component({
    selector: 'app-filter-diagnoses',
    imports: [shared],
    templateUrl: './filter-diagnoses.component.html',
    styleUrl: './filter-diagnoses.component.scss',
})
export class FilterDiagnosesComponent {
    form: FormGroup;
    @Output() searchClicked = new EventEmitter<FilterDiagnosisParam>();

    constructor(fb: FormBuilder) {
        this.form = fb.group({
            name: new FormControl<string>('', [Validators.maxLength(255)]),
        });
    }

    applyFilter() {
        this.searchClicked.emit({
            name: this.form.get('name')?.value,
            departmentName: null
        });
    }

    resetFilter() {
        this.form.get('name')?.reset();
        this.searchClicked.emit({ name: '', departmentName: null });
        this.form.markAsPristine();
    }
}
