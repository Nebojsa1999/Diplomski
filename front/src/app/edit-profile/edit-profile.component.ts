import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../api.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  form: UntypedFormGroup;
  public formInvalid = false;
  private formSubmitAttempt = false;
  private returnUrl: string;
  user: any
  users: any
  exampleArr: Array<{ id: number, gend: string }> = [
    { id: 0, gend: 'MALE' },
    { id: 1, gend: 'FEMALE' }
  ];
  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

    const userString = localStorage.getItem('user');
    if (userString == null) {
      this.router.navigate(['/login'], { queryParams: { login: 'false' } });
    }

    this.user = JSON.parse((userString) || '{}');
    console.log(this.user)
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required],
      personalId: ['', Validators.required],
      occupation: [''],
      occupationInfo: [''],
      gender: ['']

    });
  }

  async ngOnInit(): Promise<void> {
    this.users = []
    this.api.getCurrentUser().subscribe((response: any) => {
      this.users = response;

      this.form.patchValue({
        firstName: this.users.firstName,
        lastName: this.users.lastName,
        address: this.users.address,
        city: this.users.city,
        country: this.users.country,
        phone: this.users.phone,
        personalId: this.users.personalId,
        occupation: this.users.occupation,
        occupationInfo: this.users.occupationInfo,
        gender: this.users.gender
      });
    })
  }

  async onSubmit(): Promise<void> {
    this.formInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        const firstName = this.form.get('firstName')?.value;
        const lastName = this.form.get('lastName')?.value;
        const address = this.form.get('address')?.value;
        const city = this.form.get('city')?.value;
        const country = this.form.get('country')?.value;
        const phone = this.form.get('phone')?.value;
        const personalId = this.form.get('personalId')?.value;
        const occupation = this.form.get('occupation')?.value;
        const occupationInfo = this.form.get('occupationInfo')?.value;
        const gender = this.form.get('gender')?.value;

        this.api.updateProfile({
          firstName: firstName,
          lastName: lastName,
          address: address,
          city: city,
          country: country,
          phone: phone,
          personalId: personalId,
          occupation: occupation,
          occupationInfo: occupationInfo,
          gender: gender,
        }).subscribe((response: any) => {

          this.router.navigate(['/center'])
        });


      } catch (err) {
        this.formInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }
}
