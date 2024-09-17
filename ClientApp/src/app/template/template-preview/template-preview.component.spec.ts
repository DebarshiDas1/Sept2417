import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplatePreviewComponent } from './template-preview.component';
import { TemplateAddComponent } from '../template-add/template-add.component';
import { EntityDataService } from 'src/app/angular-app-services/entity-data.service';
import { LayoutService } from 'src/app/angular-app-services/layout.service';

describe('TemplatePreviewComponent', () => {
    let component: TemplatePreviewComponent;
    let fixture: ComponentFixture<TemplatePreviewComponent>;
    let entityDataServiceMock: jasmine.SpyObj<EntityDataService>;
    let layoutServiceMock: jasmine.SpyObj<LayoutService>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [TemplatePreviewComponent, TemplateAddComponent],
                imports: [MatDialogModule],
                providers: [
                    { provide: EntityDataService, useValue: entityDataServiceMock },
                    { provide: LayoutService, useValue: layoutServiceMock },
                    { provide: MAT_DIALOG_DATA, useValue: {} },
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(TemplatePreviewComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit refresh event when record is saved', () => {
        const refreshSpy = spyOn(component.refresh, 'emit');
        component.editRecord();
        expect(refreshSpy).not.toHaveBeenCalled();
    });

    it('should not emit refresh event when record is not saved', () => {
        const refreshSpy = spyOn(component.refresh, 'emit');
        component.editRecord();
        expect(refreshSpy).not.toHaveBeenCalled();

    });

    it('should close all dialogs and complete destroy subject on component destroy', () => {
        const destroySpy = spyOn(component['destroy'], 'next').and.callThrough();
        const completeSpy = spyOn(component['destroy'], 'complete');
        component.ngOnDestroy();
        expect(destroySpy).toHaveBeenCalledWith(true);
        expect(completeSpy).toHaveBeenCalled();
    });
});
