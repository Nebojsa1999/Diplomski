import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { shared } from "../../../../../app.config";

export interface FilterRoomParam {
    roomNumber: string;
    hospital: number | null
}

@Component({
    selector: 'app-filter-rooms',
    imports: [shared],
    templateUrl: './filter-rooms.component.html',
    styleUrl: './filter-rooms.component.scss',
})
export class FilterRoomsComponent {
    form: FormGroup;
    @Output() searchClicked = new EventEmitter<FilterRoomParam>();

    constructor(fb: FormBuilder) {
        this.form = fb.group({
            roomNumber: new FormControl<string>('', [Validators.maxLength(255)]),
        });
    }

    applyFilter() {
        this.searchClicked.emit({ roomNumber: this.form.get('roomNumber')?.value, hospital: null });
    }

    resetFilter() {
        this.form.get('roomNumber')?.reset();
        this.searchClicked.emit({ roomNumber: '', hospital: null });
        this.form.markAsPristine();
    }
}
