import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { shared } from "../../../../../app.config";

export interface FilterEquipmentParam {
    name: string;
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

    constructor(fb: FormBuilder) {
        this.form = fb.group({
            name: new FormControl<string>('', [Validators.maxLength(255)]),
        })
    }

    applyFilter() {
        this.searchClicked.emit({
                name: this.form.get('name')?.value,
            }
        )
    }

    resetFilter() {
        this.form.get('name')?.reset();
        this.searchClicked.emit({name: ''})
        this.form.markAsPristine();
    }
}
