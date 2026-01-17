import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { map } from "rxjs/operators";
import { catchError, of } from "rxjs";
import { ApiService } from "../../../../../common/service/api.service";
import { shared } from "../../../../../app.config";

export interface FilterEquipmentParam {
    name: string;
    hospital: number | null
}

@Component({
    selector: 'app-filter-equipments',
    imports: [shared],
    templateUrl: './filter-equipments.component.html',
    styleUrl: './filter-equipments.component.scss',
})
export class FilterEquipmentsComponent {
    form: FormGroup;
    @Output() searchClicked = new EventEmitter<FilterEquipmentParam>();
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
