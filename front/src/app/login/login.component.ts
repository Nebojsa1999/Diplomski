import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {ApiService} from "../api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup;
  public loginInvalid = false;
  private formSubmitAttempt = false;
  private returnUrl: string;
  infoMessage!: string;
  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/game';

    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

async ngOnInit(): Promise<void> {
 this.infoMessage = '';
    this.route.queryParams
    .subscribe(params => {
      if(params['login'] !== undefined && params['login'] === 'false') {
          localStorage.clear(); 
          this.infoMessage = 'Please Login!';
      }
      if(params['role'] === 'false') {
        localStorage.clear();
        this.infoMessage = 'Access denied'
      }
    });
  }

  async onSubmit(): Promise<void> {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        const username = this.form.get('username')?.value;
        const password = this.form.get('password')?.value;

        this.apiService.login({
          email: username,
          password: password
        }).subscribe((response : any) => {
          let token = response.token;
          localStorage.setItem("token", token);

          this.apiService.getCurrentUser().subscribe((response : any) => {
            let user = response;

            localStorage.setItem('user', JSON.stringify(user));

            if(user.firstLogin) {
              this.router.navigate(['/change-password']);
              return;
            }
            if(user.role == 'ADMIN_CENTER'){
              this.router.navigate(['/center']);
            }
            else {
              this.infoMessage = 'Access denied'
            }
          });
        })

      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }
}
