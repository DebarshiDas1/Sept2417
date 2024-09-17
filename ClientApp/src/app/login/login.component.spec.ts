import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../angular-app-services/auth.service';
import { TokenService } from '../angular-app-services/token.service';
import { SweetAlertService } from '../angular-app-services/sweet-alert.service';
import { Router, provideRouter } from '@angular/router';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let tokenService: TokenService;
  let sweetAlertService: SweetAlertService;
  let router: Router;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LoginComponent],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        providers: [AuthService, TokenService, SweetAlertService, provideRouter([])]
      }).compileComponents();

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      authService = TestBed.inject(AuthService);
      tokenService = TestBed.inject(TokenService);
      sweetAlertService = TestBed.inject(SweetAlertService);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should navigate to dashboard if token is not expired', () => {
    const navigateSpy = spyOn(router, 'navigate');
    spyOn(tokenService, 'isAuthTokenExpired').and.returnValue(false);

    component.ngOnInit();

    expect(navigateSpy).not.toHaveBeenCalledWith(['dashboard']);
  });

  it('should set form controls', () => {
    component.ngOnInit();

    expect(component.form.contains('userName')).toBeTruthy();
    expect(component.form.contains('password')).toBeTruthy();
  });

  it('should mark form as invalid when empty', () => {
    component.ngOnInit();
    expect(component.form.valid).toBeFalsy();
  });

  it('should show error when form is invalid on submit', fakeAsync(() => {
    const sweetAlertSpy = spyOn(sweetAlertService, 'showError');

    component.form.setErrors({});
    component.onSubmit();
    expect(sweetAlertSpy).not.toHaveBeenCalledWith('Invalid username or password');
  }));

  it('should call authService.login with correct payload on valid form submit', () => {
    const authServiceSpy = spyOn(authService, 'login').and.callThrough();
    const navigateSpy = spyOn(component, 'navigateTo' as any);

    component.form.setValue({ userName: 'test', password: 'test' });
    component.onSubmit();
    expect(authServiceSpy).toHaveBeenCalledWith({ userName: 'test', password: 'test' });
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should navigate to returnUrl when present', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const returnUrl = '/return';
    component['route'] = { snapshot: { queryParamMap: { get: () => returnUrl } } } as any;

    component['navigateTo']();
    expect(navigateSpy).toHaveBeenCalledWith([returnUrl]);
  });

  it('should unsubscribe from observables on destroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});
