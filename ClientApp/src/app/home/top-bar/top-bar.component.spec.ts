import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TopBarComponent } from './top-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TokenService } from 'src/app/angular-app-services/token.service';
import { TooltipService } from 'src/app/angular-app-services/tooltip.service';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TopBarComponent],
        providers: [
          TokenService,
          TooltipService
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(TopBarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

  it('should inject dependencies', () => {
    expect(component['router']).toBeTruthy();
    expect(component['tokenService']).toBeTruthy();
    expect(component['tooltipService']).toBeTruthy();
  });
});
