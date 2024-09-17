import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutComponent } from './logout.component';
import { Router, provideRouter } from '@angular/router';
import { TokenService } from '../angular-app-services/token.service';
import { TooltipService } from '../angular-app-services/tooltip.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../angular-app-services/theme.service';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let router: Router;
  let tokenService: TokenService;
  let tooltipService: TooltipService;
  let dialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatTooltipModule],
      providers: [
        TokenService,
        TooltipService,
        provideRouter([]),
        { provide: MatDialogRef, useValue: {} },
        {
          provide: ThemeService,
          useValue: jasmine.createSpyObj('ThemeService', ['setTheme'])
        }
      ]
    });

    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    tokenService = TestBed.inject(TokenService);
    tooltipService = TestBed.inject(TooltipService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  xit('should call tokenService.logout() and navigate to root on logout()', () => {
    const spy = spyOn(tokenService, 'logout').and.callThrough();
    const navigateSpy = spyOn(router, 'navigate');

    component.logout();

    expect(spy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
    expect(dialog.openDialogs.length).toBe(0);
  });

  it('should populate user details on ngOnInit()', () => {
    const userDetails = { name: 'John Doe', email: 'john@example.com' };
    spyOn(tokenService, 'getUserDetails').and.returnValue(userDetails);

    component.ngOnInit();
    expect(component.user).toEqual(userDetails);
  });

  it('should return true if tooltip is disabled for an element', () => {
    const element = document.createElement('div');
    spyOn(tooltipService, 'isTooltipDisabled').and.returnValue(true);

    const result = component.isTooltipDisabled(element);
    expect(result).toBeTrue();
  });

  it('should return false if tooltip is not disabled for an element', () => {
    const element = document.createElement('div');
    spyOn(tooltipService, 'isTooltipDisabled').and.returnValue(false);

    const result = component.isTooltipDisabled(element);
    expect(result).toBeFalse();
  });
});
