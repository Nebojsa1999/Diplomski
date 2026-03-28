import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { map } from "rxjs/operators";
import { catchError, of } from "rxjs";
import { ApiService } from "../../../../../common/service/api.service";
import { shared } from "../../../../../app.config";

export interface FilterDiagnosisParam {
    name: string;
    department: number | null;
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
    departments$ = this.apiService.hospitalApi.listDepartments().pipe(
        map(response => response.data),
        catchError(() => of([]))
    );

    constructor(fb: FormBuilder, private apiService: ApiService) {
        this.form = fb.group({
            name: new FormControl<string>('', [Validators.maxLength(255)]),
            department: new FormControl<number | null>(null)
        });
        this.form.get('department')?.setValue('');
    }

    applyFilter() {
        this.searchClicked.emit({
            name: this.form.get('name')?.value,
            department: this.form.get('department')?.value
        });
    }

    resetFilter() {
        this.form.get('name')?.reset();
        this.form.get('department')?.setValue('');
        this.searchClicked.emit({ name: '', department: null });
        this.form.markAsPristine();
    }
}
