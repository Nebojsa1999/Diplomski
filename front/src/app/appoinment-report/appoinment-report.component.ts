import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-appoinment-report',
  templateUrl: './appoinment-report.component.html',
  styleUrls: ['./appoinment-report.component.scss']
})
export class AppoinmentReportComponent {
  form: UntypedFormGroup;
  user: any;
  equipments: any;
  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    const userString = localStorage.getItem('user');
    if (userString == null) {
      this.router.navigate([''], { queryParams: { login: 'false' } });
    }
    this.user = JSON.parse((userString) || '{}');

    if (this.user.role != 'ADMIN_CENTER') {
      this.user = null;
      localStorage.clear();
      this.router.navigate([''], { queryParams: { role: 'false' } });
    }
    this.form = this.fb.group({
      bloodType: ['', Validators.required],
      bloodAmount: ['', Validators.required],
      noteToDoctor: ['', Validators.required],
      copperSulfate: ['', Validators.required],
      hemoglobinometer: ['', Validators.required],
      lungs: ['', Validators.required],
      heart: ['', Validators.required],
      TA: ['', Validators.required],
      TT: ['', Validators.required],
      TV: ['', Validators.required],
      bagType: ['', Validators.required],
      note: ['', Validators.required],
      punctureSite: ['', Validators.required],
      startOfGiving: ['', Validators.required],
      endOfGiving: ['', Validators.required],
      reasonForPrematureTerminationOfBloodDonation: ['', Validators.required],
      equipment: ['', Validators.required],
      equipmentAmount: ['', Validators.required],
      denied: ['', Validators.required],
      reasonForDenying: ['', Validators.required]

    });
  }
  ngOnInit(): void {
    this.api.getEquipments().subscribe((response=>{
      this.equipments = response;
    }))
  }
  async onSubmit(): Promise<void> {

    const bloodType = this.form.get('bloodType')?.value;
    const bloodAmount = this.form.get('bloodAmount')?.value;
    const noteToDoctor = this.form.get('noteToDoctor')?.value;
    const copperSulfate = this.form.get('copperSulfate')?.value;
    const hemoglobinometer = this.form.get('hemoglobinometer')?.value;
    const lungs = this.form.get('lungs')?.value;
    const heart = this.form.get('heart')?.value;
    const TA = this.form.get('TA')?.value;
    const TT = this.form.get('TT')?.value;
    const TV = this.form.get('TV')?.value;
    const bagType = this.form.get('bagType')?.value;
    const note = this.form.get('note')?.value;
    const punctureSite = this.form.get('punctureSite')?.value;
    const startOfGiving = this.form.get('startOfGiving')?.value;
    const endOfGiving = this.form.get('endOfGiving')?.value;
    const reasonForPrematureTerminationOfBloodDonation = this.form.get('reasonForPrematureTerminationOfBloodDonation')?.value;
    const equipment = this.form.get('equipment')?.value;
    const equipmentAmount = this.form.get('equipmentAmount')?.value;
    const denied = this.form.get('denied')?.value;
    const reasonForDenying = this.form.get('reasonForDenying')?.value;
    console.log(equipment)
    this.api.createAppointmentReport({
      bloodType: bloodType,
      bloodAmount: bloodAmount,
      noteToDoctor: noteToDoctor,
      copperSulfate: copperSulfate,
      hemoglobinometer: hemoglobinometer,
      lungs: lungs,
      heart: heart,
      ta: TA,
      tt: TT,
      tv: TV,
      bagType: bagType,
      note: note,
      punctureSite: punctureSite,
      startOfGiving: startOfGiving,
      endOfGiving: endOfGiving,
      reasonForPrematureTerminationOfBloodDonation: reasonForPrematureTerminationOfBloodDonation,
      equipmentId: equipment,
      equipmentAmount: equipmentAmount,
      denied: denied,
      reasonForDenying: reasonForDenying
    }).subscribe((response: any) => {

      this.router.navigate(['/appointments'])
    });


  }
}

