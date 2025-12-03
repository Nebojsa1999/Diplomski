import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-deny-appointment',
  templateUrl: './deny-appointment.component.html',
  styleUrls: ['./deny-appointment.component.scss']
})
export class DenyAppointmentComponent {
  user: any;
  appointmentIdString: any;
  appointmentId: any;
  appointment: any;
  constructor(private router: Router, private api: ApiService, private route: ActivatedRoute,
  ) {
    const userString = localStorage.getItem('user');
    if (userString == null) {
      this.router.navigate(['/login'], { queryParams: { login: 'false' } });
    }

    this.user = JSON.parse((userString) || '{}');
    if (this.user.role != 'ADMIN_CENTER') {
      this.user = null;
      localStorage.clear();
      this.router.navigate([''], { queryParams: { role: 'false' } });
    }
    this.appointmentIdString = this.route.snapshot.queryParamMap.get('id');
    this.appointmentId = parseInt(this.appointmentIdString);

  }

  async ngOnInit(): Promise<void> {
    this.api.getAppointment(this.appointmentId).subscribe((response => {
      this.appointment = response;
    }))
  }

  deny() {
    this.api.deny({
      id: this.appointmentId
    }).subscribe((response=>{
      this.router.navigate(['/appointments'])
    }));
  }
}
