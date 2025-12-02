import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../api.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  form: UntypedFormGroup;
  public changePasswordInvalid = false;
  private formSubmitAttempt = false;
  private returnUrl: string;
  user: any;
  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    const userString = localStorage.getItem('user');
    if (userString == null) {
      this.router.navigate(['/login'], { queryParams: { login: 'false' } });
    }

    this.user = JSON.parse((userString) || '{}');
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/game';

    this.form = this.fb.group({
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<void> {
    this.changePasswordInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        const password = this.form.get('password')?.value;

        this.apiService.changePassword({
          password: password
        }).subscribe((response: any) => {
          this.router.navigate(['/center']);
        })

      } catch (err) {
        this.changePasswordInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }

}
