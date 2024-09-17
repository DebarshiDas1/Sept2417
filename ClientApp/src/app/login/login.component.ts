import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginInfoPayload } from './login-info-payload';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../angular-app-services/auth.service';
import { TokenService } from '../angular-app-services/token.service';
import { AppConfigService } from '../app-config.service';
import { SweetAlertService } from '../angular-app-services/sweet-alert.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  private formSubmitAttempt: boolean = false;
  protected destroy$ = new Subject();
  hide = true;
  tenantTitle: string = '';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private sweetAlertService: SweetAlertService
  ) {
    if (!this.tokenService.isAuthTokenExpired()) {
      this.navigateTo();
    }
  }

  ngOnInit() {
    this.tenantTitle = AppConfigService.appConfig?.app?.title;
    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form?.get(field)?.valid && this.form?.get(field)?.touched) ||
      (this.form?.get(field)?.untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      const loginDetail: LoginInfoPayload = {
        userName: this.form.value.userName,
        password: this.form.value.password
      };
      this.authService.login(loginDetail)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (token: any) => {
            this.tokenService.setToken(token);
            this.navigateTo();
          },
          error: () => {
            this.sweetAlertService.showError('Invalid username or password');
          }
        });
    }
    this.formSubmitAttempt = true;
  }

  private navigateTo(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) {
      this.router.navigate([returnUrl]);
    } else {
      this.router.navigate(['dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
