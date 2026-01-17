import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { map } from "rxjs/operators";
import { catchError, of } from "rxjs";
import { ApiService } from "../../../../../common/service/api.service";
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
    hospitals$ = this.apiService.hospitalApi.list().pipe(
        map(response => response.data),
        catchError(error => of([]))
    )

    constructor(fb: FormBuilder, private apiService: ApiService) {
        this.form = fb.group({
            roomNumber: new FormControl<string>('', [Validators.maxLength(255)]),
            hospital: new FormControl<number | null>(null)
        })

        this.form.get('hospital')?.setValue('');
    }

    applyFilter() {
        this.searchClicked.emit({
                roomNumber: this.form.get('roomNumber')?.value,
                hospital: this.form.get('hospital')?.value
            }
        )
    }

    resetFilter() {
        this.form.get('roomNumber')?.reset();
        this.form.get('hospital')?.setValue('');
        this.searchClicked.emit({roomNumber: '', hospital: null})
        this.form.markAsPristine();
    }
}
