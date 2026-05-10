import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { shared } from "../../../../../app.config";

@Component({
    selector: 'app-filter-appointment',
    imports: [shared],
    templateUrl: './filter-appointment.component.html',
    styleUrl: './filter-appointment.component.scss',
})
export class FilterAppointmentComponent {
    form: FormGroup;
    @Output() dateRange = new EventEmitter<{ from: Date | null, to: Date | null }>();

    constructor(fb: FormBuilder) {
        this.form = fb.group({
            from: new FormControl<Date | null>(null),
            to: new FormControl<Date | null>(null)
        });

        this.form.get('to')?.valueChanges.subscribe(end => {
            const start = this.form.get('from')?.value;

            if (start && end) {
                this.dateRange.emit({from: start, to: end});
            }
        });
    }

    resetDateRange() {
        this.form.get('from')?.reset();
        this.form.get('to')?.reset();
        this.dateRange.emit({from: null, to: null})
    }
}
