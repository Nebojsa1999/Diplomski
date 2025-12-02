import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from "../api.service";

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  appointments = [];
  displayedColumns: string[] = ['date', 'duration', 'adminCenter', 'patient','approve','deny'];
  user: any;

  constructor(private api: ApiService, private router: Router) {
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
  }

  ngOnInit(): void {
    this.api.getScheduledAppointmentsThatAreNotFinished(this.user.centerAccount.id).subscribe((response: any) => {
      this.appointments = response;
    });
  }

}
