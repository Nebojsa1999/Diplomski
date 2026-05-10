import { Component, EventEmitter, Output } from '@angular/core';
import { shared } from "../../../../../app.config";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Role } from "../../../../../rest/user/user.model";

export interface FilterUserParam {
    name: string;
    role: Role | null;
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
    roles = Object.values(Role);

    constructor(fb: FormBuilder) {
        this.form = fb.group({
            name: new FormControl<string>('', [Validators.maxLength(255)]),
            role: new FormControl<Role | null>(null)
        });

        this.form.get('role')?.setValue('');
    }

    applyFilter() {
        this.searchClicked.emit({
            name: this.form.get('name')?.value,
            role: this.form.get('role')?.value || null
        });
    }

    resetFilter() {
        this.form.get('name')?.reset();
        this.form.get('role')?.setValue('');
        this.searchClicked.emit({ name: '', role: null });
        this.form.markAsPristine();
    }
}
