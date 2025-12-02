import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-single-appointment',
  templateUrl: './single-appointment.component.html',
  styleUrls: ['./single-appointment.component.scss']
})
export class SingleAppointmentComponent {
  date: any;
  month: any;
  fixedMonth: any;
  year: any;
  stringDate: any;
  user: any;
  appointments: any;
  displayedColumns: string[] = ['date', 'duration', 'adminCenter', 'patient','approve','deny'];
  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) {

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

    this.date = this.route.snapshot.paramMap.get("date");
    this.month = this.route.snapshot.paramMap.get("month");
    this.year = this.route.snapshot.paramMap.get("year");
    this.fixedMonth = parseInt(this.month) + 1;
    this.stringDate = this.year + "-" + this.fixedMonth + "-" + this.date;
    console.log(new Date(this.stringDate))

  }

  async ngOnInit(): Promise<void> {


    this.appointments = []
    this.api.getAppointmentsDate({
      date : this.stringDate,
      centerAccountId:  this.user.centerAccount.id
    }).subscribe((response: any) => {
      this.appointments = response;

     
    })
}
}
