import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { shared } from "../../../../../../app.config";

@Component({
  selector: 'app-filter-hospital',
  imports: [shared],
  templateUrl: './filter-hospital.component.html',
  styleUrl: './filter-hospital.component.scss',
})
export class FilterHospitalComponent {
  form: FormGroup;
  @Output() searchClicked = new EventEmitter<string>();

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      name: new FormControl<string>('', [Validators.maxLength(255)])
    })
  }

  applyFilter() {
    this.searchClicked.emit( this.form.get('name')?.value)
  }

  resetFilter() {
    this.form.get('name')?.reset();

    this.searchClicked.emit( '')
    this.form.markAsPristine();
  }
}
