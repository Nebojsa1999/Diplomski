import { Component, ViewEncapsulation } from '@angular/core';
import { MatCalendarCellClassFunction, MatCalendarCellCssClasses, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map, take } from 'rxjs/operators';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-work-calendar',
  templateUrl: './work-calendar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./work-calendar.component.scss']
})
export class WorkCalendarComponent {
  selected: Date | null;
  user: any;
  day: number;
  month: number;
  year: number;
  appointments: any;
  dateAndTimeArray: BehaviorSubject<any>;
  appointmentDates: any[] = [];
  selectedDate: Date;

  constructor(private api: ApiService, private router: Router) {
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
    this.dateAndTimeArray = new BehaviorSubject([]);
  }

  ngOnInit() {
    this.api.getScheduledAppointmentsThatAreNotFinished(this.user.centerAccount.id).subscribe((response: any) => {
      this.appointments = response;
      this.dateAndTimeArray.next(this.appointments.map((appointment: any) => appointment.dateAndTime));
    });

  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    this.dateAndTimeArray.subscribe(val => {
      this.appointmentDates = [];
      for (let i = 0; i < val.length; i++) {
        let dateOfAppointment = new Date(val[i]);
        this.appointmentDates.push({
          day: dateOfAppointment.getDate(),
          month: dateOfAppointment.getMonth(),
          year: dateOfAppointment.getFullYear()
        });
      }

    });
    return this.appointmentDates.some(d => d.day === cellDate.getDate() && d.month === cellDate.getMonth() && d.year === cellDate.getFullYear()) ? 'example-custom-date-class' : '';

  }
  onDateSelection(date: Date | null) {
    if (this.appointmentDates.some(d => d.day === date?.getDate() && d.month === date?.getMonth() && d.year === date?.getFullYear())) {
      this.router.navigate(['/single-appointment', date?.getDate(), date?.getMonth(), date?.getFullYear()]);
    }
  }


}


