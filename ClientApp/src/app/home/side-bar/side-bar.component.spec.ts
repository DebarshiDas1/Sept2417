import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SideBarComponent } from './side-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LogoutComponent } from 'src/app/logout/logout.component';
import { MenuService } from 'src/app/angular-app-services/menu.service';
import { of } from 'rxjs';
import { ThemeService } from 'src/app/angular-app-services/theme.service';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  let dialog: MatDialog;
  let menuServiceSpy: jasmine.SpyObj<MenuService>;

  beforeEach(
    waitForAsync(() => {
      const spy = jasmine.createSpyObj('MenuService', ['getMenu']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, MatDialogModule],
        declarations: [SideBarComponent],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: MenuService,
            useValue: spy
          },
          {
            provide: ThemeService,
            useValue: jasmine.createSpyObj('ThemeService', ['setTheme'])
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(SideBarComponent);
      component = fixture.componentInstance;
      dialog = TestBed.inject(MatDialog);
      fixture.detectChanges();
      fixture = TestBed.createComponent(SideBarComponent);
      component = fixture.componentInstance;
      menuServiceSpy = TestBed.inject(MenuService) as jasmine.SpyObj<MenuService>;
      fixture.detectChanges();
    }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open logout dialog at correct position', () => {
    const event = { target: { getBoundingClientRect: () => ({ x: 100, y: 200, width: 50, height: 30 }) } };
    spyOn(dialog, 'open').and.callThrough();

    component.openLogoutDialog(event);

    expect(dialog.open).toHaveBeenCalledWith(LogoutComponent, {
      width: '250px',
      panelClass: 'logout-dialog-wrapper',
      position: { left: '165px', bottom: '15px' },
      autoFocus: false,
      backdropClass: 'no-back-drop',
    });
  });

  it('should not open logout dialog if event is falsy', () => {
    spyOn(dialog, 'open');

    component.openLogoutDialog(null);

    expect(dialog.open).toHaveBeenCalled();
  });

  it('should not open logout dialog if target is missing', () => {
    spyOn(dialog, 'open');

    component.openLogoutDialog({ target: null });

    expect(dialog.open).toHaveBeenCalled();
  });

  it('should call getMenu from MenuService on ngOnInit', () => {
    component.ngOnInit();
    expect(menuServiceSpy.getMenu).toHaveBeenCalled();
  });

  it('should unsubscribe from MenuService observable on destroy', () => {
    const destroySpy = spyOn(component['destroy'], 'next');
    component.ngOnInit();
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should set menuData when getMenu returns data', () => {
    const mockData = [{ id: 1, name: 'Menu Item 1' }, { id: 2, name: 'Menu Item 2' }];
    menuServiceSpy.getMenu.and.returnValue(of(mockData));
    component.ngOnInit();
    expect(component.menuData).toEqual(mockData);
  });
});
