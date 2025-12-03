import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.scss']
})
export class CreateAppointmentComponent implements OnInit {

  user: any;
  form: UntypedFormGroup;
  appointment: any;
  adminsOfCenter: any;
  constructor(private router: Router, private fb: UntypedFormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      date: [''],
      duration: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      adminsOfCenter: ['']
    });

    const userString = localStorage.getItem('user');
    if (userString == null) {
      this.user = null;
      localStorage.clear();
      this.router.navigate([''], { queryParams: { login: 'false' } });
    }

    this.user = JSON.parse((userString) || '{}');

    if (this.user.role != 'ADMIN_CENTER') {
      this.user = null;
      localStorage.clear();
      this.router.navigate([''], { queryParams: { role: 'false' } });
    }
  }

  ngOnInit(): void {
    this.api.getAdminsOfCenter(this.user.centerAccount.id).subscribe((response: any) => {
      this.adminsOfCenter = response;
    });
  }

  onSubmit() {
    const date = this.form.get('date')?.value;
    const duration = this.form.get('duration')?.value;
    const adminOfCenterId = this.form.get('adminsOfCenter')?.value;
    this.api.createAppointment({
      date: date,
      duration: duration,
      adminOfCenterId: adminOfCenterId
    }).subscribe((response: any) => {
      this.router.navigate(['/center'])
    });
  }
}

