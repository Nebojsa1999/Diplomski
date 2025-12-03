import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: UntypedFormGroup;
  public loginInvalid = false;
  private formSubmitAttempt = false;
  private returnUrl: string;

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/game';

    this.form = this.fb.group({
      email: ['', Validators.email],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {

  }

  async onSubmit(): Promise<void> {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        const email = this.form.get('email')?.value;
        const password = this.form.get('password')?.value;
        const firstName = this.form.get('firstName')?.value;
        const lastName = this.form.get('lastName')?.value;
        const address = this.form.get('address')?.value;
        const city = this.form.get('city')?.value;
        const country = this.form.get('country')?.value;
        const phone = this.form.get('phone')?.value;

        this.api.register({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          address: address,
          city: city,
          country: country,
          phone: phone
        }).subscribe((response : any) => {

          this.router.navigate(['/'])
        });


      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }
}
