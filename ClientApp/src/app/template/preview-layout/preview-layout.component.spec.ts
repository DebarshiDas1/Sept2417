import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PreviewLayoutComponent } from './preview-layout.component';

describe('PreviewLayoutComponent', () => {
    let component: PreviewLayoutComponent;
    let fixture: ComponentFixture<PreviewLayoutComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [PreviewLayoutComponent]
            }).compileComponents();

            fixture = TestBed.createComponent(PreviewLayoutComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});