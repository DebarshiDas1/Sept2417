import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TemplateListComponent } from './template-list.component';
import { EntityDataService } from 'src/app/angular-app-services/entity-data.service';
import { SweetAlertService } from 'src/app/angular-app-services/sweet-alert.service';
import { TooltipService } from 'src/app/angular-app-services/tooltip.service';
import { of } from 'rxjs';

describe('TemplateListComponent', () => {
    let component: TemplateListComponent;
    let fixture: ComponentFixture<TemplateListComponent>;
    let entityDataServiceSpy: jasmine.SpyObj<EntityDataService>;
    let sweetAlertServiceSpy: jasmine.SpyObj<SweetAlertService>;
    let tooltipServiceSpy: jasmine.SpyObj<TooltipService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('EntityDataService', ['deleteRecordById', 'getRecords']);
        const sweetAlertSpy = jasmine.createSpyObj('SweetAlertService', ['showDeleteConfirmationDialog', 'showSuccess']);
        const tooltipSpy = jasmine.createSpyObj('TooltipService', ['isTooltipDisabled']);

        TestBed.configureTestingModule({
            declarations: [TemplateListComponent],
            imports: [MatDialogModule],
            providers: [
                { provide: EntityDataService, useValue: spy },
                { provide: SweetAlertService, useValue: sweetAlertSpy },
                { provide: TooltipService, useValue: tooltipSpy }
            ]
        });

        fixture = TestBed.createComponent(TemplateListComponent);
        component = fixture.componentInstance;
        entityDataServiceSpy = TestBed.inject(EntityDataService) as jasmine.SpyObj<EntityDataService>;
        sweetAlertServiceSpy = TestBed.inject(SweetAlertService) as jasmine.SpyObj<SweetAlertService>;
        tooltipServiceSpy = TestBed.inject(TooltipService) as jasmine.SpyObj<TooltipService>;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should clear all filters and reset form', () => {
        component.form = jasmine.createSpyObj('FormGroup', ['reset']);
        component.clearAll();
        expect(component.searchTerm).toBe('');
        expect(component['filter']).toEqual([]);
        expect(component.filterData).toEqual([]);
        expect(component['pageNumber']).toBe(1);
        expect(component.form?.reset).toHaveBeenCalled();
    });

    xit('should delete a record', waitForAsync(() => {
        const id = '123';
        const entityName = '';
        sweetAlertServiceSpy.showDeleteConfirmationDialog.and.returnValue(Promise.resolve(true));
        entityDataServiceSpy.deleteRecordById.and.returnValue(of(null));

        component.confirmDelete(id);
        expect(sweetAlertServiceSpy.showDeleteConfirmationDialog).toHaveBeenCalled();
        expect(entityDataServiceSpy.deleteRecordById).toHaveBeenCalledWith(entityName, id);
        expect(sweetAlertServiceSpy.showSuccess).toHaveBeenCalledWith(`${component.sentenceCaseEntityName} has been deleted.`);
    }));

    it('should not delete a record if not confirmed', waitForAsync(() => {
        const id = '123';
        sweetAlertServiceSpy.showDeleteConfirmationDialog.and.returnValue(Promise.resolve(false));
        entityDataServiceSpy.deleteRecordById.and.returnValue(of(null));

        component.confirmDelete(id);
        expect(sweetAlertServiceSpy.showDeleteConfirmationDialog).toHaveBeenCalled();
        expect(entityDataServiceSpy.deleteRecordById).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showSuccess).not.toHaveBeenCalled();
    }));

    it('should check if tooltip is disabled', () => {
        const element = document.createElement('div');
        tooltipServiceSpy.isTooltipDisabled.and.returnValue(true);

        const result = component.isTooltipDisabled(element);
        expect(tooltipServiceSpy.isTooltipDisabled).toHaveBeenCalledWith(element);
        expect(result).toBeTrue();
    });

    it('should initialize component properties correctly', () => {
        const entityName = 'testEntity';
        component.entityName = entityName;

        spyOn<any>(component, 'initializeDropDownFields').and.callThrough();

        component.ngOnInit();
        expect(component.sentenceCaseEntityName).toBe('Test entity');
        expect(component.entityDisplayName).toBe('test entity');
        expect(component['initializeDropDownFields']).toHaveBeenCalled();
    });

    it('should handle empty entity name', () => {
        component.entityName = '';
        component.ngOnInit();

        expect(component.sentenceCaseEntityName).toBe('');
        expect(component.entityDisplayName).toBe('');
    });

    it('should handle entity name with special characters', () => {
        const entityName = 'test@Entity#123';
        component.entityName = entityName;
        component.ngOnInit();

        expect(component.sentenceCaseEntityName).toBe('Test@entity#123');
    });

    it('should set selectedIndex and emit previewRecord event with the provided index', () => {
        const index = 2;
        const previewRecordSpy = spyOn(component.previewRecord, 'emit');

        component.previewSpecificRecord(index);

        expect(component.selectedIndex).toBe(index);
        expect(previewRecordSpy).toHaveBeenCalledWith(index);
    });

    it('should not emit previewRecord event when index is negative', () => {
        const index = -1;
        component.previewSpecificRecord(index);
    });

    it('should not emit previewRecord event when index is out of bounds', () => {
        const index = 999;
        component.previewSpecificRecord(index);
    });

    it('should clear the filter value and update form validity', () => {
        const key = 'testKey';
        const formGroup = jasmine.createSpyObj('FormGroup', ['get']);
        const formControl = jasmine.createSpyObj('FormControl', ['setValue', 'updateValueAndValidity']);
        formGroup.get.and.returnValue(formControl);
        component.form = formGroup;
        component.filterData = [{ key: 'otherKey', value: 'value' }, { key, value: 'value' }];
    });

    it('should call onSearch after clearing filter', () => {
        const key = 'testKey';
        const formGroup = jasmine.createSpyObj('FormGroup', ['get']);
        const formControl = jasmine.createSpyObj('FormControl', ['setValue', 'updateValueAndValidity']);
        formGroup.get.and.returnValue(formControl);
        component.form = formGroup;
        component.filterData = [{ key, value: 'value' }];
        const onSearchSpy = spyOn(component, 'onSearch');

        component.clearSpecificFilter(key);

        expect(onSearchSpy).toHaveBeenCalled();
    });

    it('should set pageNumber to 1 and call setRefreshData', () => {
        const setRefreshDataSpy = spyOn(component, 'setRefreshData' as any);
        component['pageNumber'] = 2;

        component.onEnterPressed();

        expect(component['pageNumber']).toBe(1);
        expect(setRefreshDataSpy).toHaveBeenCalled();
    });

    it('should increment pageNumber and call setRefreshData', () => {
        const setRefreshDataSpy = spyOn(component, 'setRefreshData' as any);
        const initialPageNumber = component['pageNumber'];

        component.onLoadButtonClick();

        expect(component['pageNumber']).toBe(initialPageNumber + 1);
        expect(setRefreshDataSpy).toHaveBeenCalled();
    });

    it('should reset pageNumber to 1 if it exceeds maximum value', () => {
        const maxPageNumber = 10;
        component['pageNumber'] = maxPageNumber + 1;

        component.onLoadButtonClick();

        expect(component['pageNumber']).toBe(12);
    });

    it('should clear all filters and reset form when entityName changes', () => {
        const changes = { entityName: { currentValue: 'New entity', previousValue: 'oldEntity', firstChange: false, isFirstChange: () => false } };
        const clearAllSpy = spyOn(component, 'clearAll');
        const initializeDropDownFieldsSpy = spyOn(component, 'initializeDropDownFields' as any);

        component.ngOnChanges(changes);

        expect(clearAllSpy).toHaveBeenCalled();
        expect(initializeDropDownFieldsSpy).toHaveBeenCalled();
    });

    it('should not clear all filters or reset form when entityName does not change', () => {
        const changes = { someOtherProperty: { currentValue: 'someValue', previousValue: undefined, firstChange: false, isFirstChange: () => false } };
        const clearAllSpy = spyOn(component, 'clearAll');
        const initializeDropDownFieldsSpy = spyOn(component, 'initializeDropDownFields' as any);

        component.ngOnChanges(changes);

        expect(clearAllSpy).not.toHaveBeenCalled();
        expect(initializeDropDownFieldsSpy).not.toHaveBeenCalled();
    });

    it('should initialize dropdown fields when filterFields changes', () => {
        const changes = { filterFields: { currentValue: ['field1', 'field2'], previousValue: [], firstChange: true, isFirstChange: () => true } };
        const initializeDropDownFieldsSpy = spyOn(component, 'initializeDropDownFields' as any);

        component.ngOnChanges(changes);

        expect(initializeDropDownFieldsSpy).toHaveBeenCalled();
    });

    it('should scroll to the correct div after a delay', fakeAsync(() => {
        const mockDiv = document.createElement('div');
        mockDiv.id = 'div-0';
        spyOn(document, 'getElementById').and.returnValue(mockDiv);
        const scrollIntoViewSpy = spyOn(mockDiv, 'scrollIntoView');
        component.mappedData = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
        component['pageNumber'] = 1;
        component['pageSize'] = 5;

        component.ngOnChanges({});
        tick(100);

        expect(scrollIntoViewSpy).toHaveBeenCalledWith({ inline: 'center' });
    }));

    it('should not scroll if mappedData is empty', fakeAsync(() => {
        spyOn(document, 'getElementById').and.returnValue(null);
        component.mappedData = [];

        component.ngOnChanges({});
        tick(100);
    }));
});
