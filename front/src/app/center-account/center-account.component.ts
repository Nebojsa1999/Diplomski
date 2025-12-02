import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { MouseEvent } from '@agm/core';


@Component({
  selector: 'app-center-account',
  templateUrl: './center-account.component.html',
  styleUrls: ['./center-account.component.scss']
})
export class CenterAccountComponent implements OnInit {
  @ViewChild("search", { static: false }) searchElementRef: ElementRef;
  public searchControl: FormControl;

  zoom: number = 18;

  // initial center position for the map
  latitude: number;
  longitude: number;


  user: any;
  form: FormGroup;
  centeraccount: any;
  adminOfCenters: any;
  displayedColumnsOfAdmins: string[] = ['Name', 'Surname', 'Phone'];
  appointments: any;
  displayedColumnsOfAppointments: string[] = ['Date', 'Duration', 'AdminOfCenter']
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private api: ApiService

  ) {

    this.form = this.fb.group({
      name: [''],
      address: [''],
      description: [''],
      startTime: [''],
      endTime: [''],
      latitude: [''],
      longitude: [''],
      country: [''],
      city: ['']

    });
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

  async ngOnInit(): Promise<void> {


    this.centeraccount = []
    this.api.getCenterAccount().subscribe((response: any) => {
      this.centeraccount = response;

      this.form.patchValue({

        name: this.centeraccount.name,
        address: this.centeraccount.address,
        description: this.centeraccount.description,
        startTime: this.centeraccount.startTime,
        endTime: this.centeraccount.endTime,
        latitude: this.centeraccount.latitude,
        longitude: this.centeraccount.longitude,
        country: this.centeraccount.country,
        city: this.centeraccount.city
        
      });
      this.latitude = this.centeraccount.latitude;
      this.longitude = this.centeraccount.longitude;
    })


    this.api.getAdminsOfCenter(this.user.centerAccount.id).subscribe((response: any) => {
      this.adminOfCenters = response;
    });

    this.api.getAppointments(this.user.centerAccount.id).subscribe((response: any) => {
      this.appointments = response;
    });
  }


  async onSubmit(): Promise<void> {

    const name = this.form.get('name')?.value;
    const address = this.form.get('address')?.value;
    const description = this.form.get('description')?.value;
    const startTime = this.form.get('startTime')?.value;
    const endTime = this.form.get('endTime')?.value;
    const latitude = this.form.get('latitude')?.value;
    const longitude = this.form.get('longitude')?.value;
    const city = this.form.get('city')?.value;
    const country = this.form.get('country')?.value;

    this.api.updateCenterAccount({
      name: name,
      address: address,
      description: description,
      startTime: startTime,
      endTime: endTime,
      latitude: latitude,
      longitude: longitude,
      city: city,
      country: country,


    }).subscribe((response: any) => {
      this.ngOnInit()

    });


  }
}
