import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent {
  user: any;
  form: UntypedFormGroup;
  appointments: any;
  displayedColumns: string[] = ['Name', 'Surname', 'DateOfAppointment'];
  constructor(private router: Router, private api: ApiService, private fb: UntypedFormBuilder
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

  }
    sortName(): any {
    this.api.getUsersFromScheduledAppointmets({
      centerAccountId: this.user.centerAccount.id,
      sort: 'NAME'
    }).subscribe((response => {
      this.appointments = response;
    }))
  }

  sortSurname(): any {
    this.api.getUsersFromScheduledAppointmets({
      centerAccountId: this.user.centerAccount.id,
      sort: 'SURNAME'
    }).subscribe((response => {
      this.appointments = response;
    }))
  }

  sortDate(): any {
    this.api.getUsersFromScheduledAppointmets({
      centerAccountId: this.user.centerAccount.id,
      sort: 'DATE'
    }).subscribe((response => {
      this.appointments = response;
    }))
  }
}
