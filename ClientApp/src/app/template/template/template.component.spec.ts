import { ActivatedRoute } from '@angular/router';
import { TemplateComponent } from './template.component';
import { LayoutService } from 'src/app/angular-app-services/layout.service';
import { EntityDataService } from 'src/app/angular-app-services/entity-data.service';
import { TestBed } from '@angular/core/testing';
import { IDataState } from '../tempale-list/idata-state.interface';

describe('TemplateComponent', () => {
    let component: TemplateComponent;
    let entityDataService: jasmine.SpyObj<EntityDataService>;
    let layoutService: jasmine.SpyObj<LayoutService>;
    let route: ActivatedRoute;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TemplateComponent],
            providers: [
                { provide: EntityDataService, useValue: entityDataService },
                { provide: LayoutService, useValue: layoutService },
                { provide: ActivatedRoute, useValue: route },
                TemplateComponent
            ]
        });

        component = TestBed.inject(TemplateComponent);
        entityDataService = TestBed.inject(EntityDataService) as jasmine.SpyObj<EntityDataService>;
        route = TestBed.inject(ActivatedRoute);
    });

    it('should handle empty entity name', () => {
        const resetDataSpy = spyOn(component, 'resetData' as any);
        const getListSpy = spyOn(component, 'getList' as any);
        spyOn(component, 'getEntityName' as any).and.returnValue('');

        component.ngOnInit();
        expect(resetDataSpy).not.toHaveBeenCalled();
        expect(getListSpy).not.toHaveBeenCalled();
    });

    it('should handle null entity name', () => {
        const resetDataSpy = spyOn(component, 'resetData' as any);
        const getListSpy = spyOn(component, 'getList' as any);
        spyOn(component, 'getEntityName' as any).and.returnValue(null);

        component.ngOnInit();
        expect(resetDataSpy).not.toHaveBeenCalled();
        expect(getListSpy).not.toHaveBeenCalled();
    });

    it('should handle undefined entity name', () => {
        const resetDataSpy = spyOn(component, 'resetData' as any);
        const getListSpy = spyOn(component, 'getList' as any);
        spyOn(component, 'getEntityName' as any).and.returnValue(undefined);

        component.ngOnInit();
        expect(resetDataSpy).not.toHaveBeenCalled();
        expect(getListSpy).not.toHaveBeenCalled();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should reset records array', () => {
        component['records'] = [{ id: '1' }, { id: '2' }];
        component.onRefreshData();
        expect(component['records']).toEqual([]);
    });

    it('should reset mappedListData array', () => {
        component.mappedListData = [{ id: '1', fieldName: 'test', value: 'value' }];
        component.onRefreshData();
        expect(component.mappedListData).toEqual([]);
    });

    it('should reset mappedPreviewData array', () => {
        component.mappedPreviewData = [{ id: '1', fieldName: 'test', value: 'value' }];
        component.onRefreshData();
        expect(component.mappedPreviewData).toEqual([]);
    });

    it('should load data on filter change', () => {
        const loadDataSpy = spyOn(component, 'loadData' as any);
        const filters = [{ fieldName: 'testField', value: 'testValue' }];

        component.onFilterChange(filters);
        expect(component['filters']).toEqual(filters);
        expect(component['pageNumber']).toBe(1);
        expect(loadDataSpy).toHaveBeenCalled();
    });

    it('should refresh data on refresh', () => {
        const onFilterChangeSpy = spyOn(component, 'onFilterChange');

        component.onRefresh();
        expect(onFilterChangeSpy).toHaveBeenCalledWith([], component.selectedId);
    });

    it('should map preview data correctly', () => {
        const record = { id: '1', testField: 'testValue' };
        const editLayout = [{ fieldName: 'testField', dataType: 'string' }];
        component['editLayout'] = editLayout;

        component['mapPreviewData'](record);
        expect(component.selectedId).toBe('1');
        expect(component.mappedPreviewData).toEqual([{ id: '1', fieldName: 'testField', dataType: 'string', fields: [], value: 'testValue' }]);
    });

    it('should format data correctly', () => {
        const record = { id: '1', testField: '2023-05-01T00:00:00Z', numericField: 1234.56, booleanField: true, guidField: 'testGuid' };
        const numericFieldInfo = { fieldName: 'numericField', dataType: 'numeric' };
        const booleanFieldInfo = { fieldName: 'booleanField', dataType: 'boolean' };
        const guidFieldInfo = { fieldName: 'guidField', dataType: 'guid' };

        const formattedNumeric = component['getFormattedData'](record, numericFieldInfo);
        const formattedBoolean = component['getFormattedData'](record, booleanFieldInfo);
        const formattedGuid = component['getFormattedData'](record, guidFieldInfo);

        expect(formattedNumeric).toBe('1,234.56');
        expect(formattedBoolean).toBe('Yes');
        expect(formattedGuid).toBe('testGuid');
    });

    it('should map preview data correctly when records is empty', () => {
        component['records'] = [];
        component.previewRecord(0);

        expect(component.selectedId).toEqual('');
        expect(component.mappedPreviewData).toEqual([]);
    });

    it('should map preview data correctly when index is out of bounds', () => {
        component['records'] = [{ id: '1', testField: 'testValue' }];

        component.previewRecord(1);

        expect(component.selectedId).toEqual('');
        expect(component.mappedPreviewData).toEqual([]);
    });

    it('should load data when pageNumber is not 1', () => {
        const loadDataSpy = spyOn(component, 'loadData' as any);
        const emitedData: IDataState = {
            pageNumber: 2,
            searchTerm: 'test',
            filter: [{ fieldName: 'field', value: 'value' }]
        };

        component.onLoadNext(emitedData);

        expect(component['pageNumber']).toBe(2);
        expect(component['searchTerm']).toBe('test');
        expect(component['filters']).toEqual(emitedData.filter);
        expect(loadDataSpy).toHaveBeenCalled();
    });

    it('should refresh data when pageNumber is 1', () => {
        const onRefreshDataSpy = spyOn(component, 'onRefreshData');
        const loadDataSpy = spyOn(component, 'loadData' as any);
        const emitedData: IDataState = {
            pageNumber: 1,
            searchTerm: 'test',
            filter: [{ fieldName: 'field', value: 'value' }]
        };

        component.onLoadNext(emitedData);

        expect(component['pageNumber']).toBe(1);
        expect(component['searchTerm']).toBe('test');
        expect(component['filters']).toEqual(emitedData.filter);
        expect(onRefreshDataSpy).toHaveBeenCalled();
        expect(loadDataSpy).toHaveBeenCalled();
    });

    it('should handle empty filters', () => {
        const loadDataSpy = spyOn(component, 'loadData' as any);
        const emitedData: IDataState = {
            pageNumber: 2,
            searchTerm: 'test',
            filter: []
        };

        component.onLoadNext(emitedData);

        expect(component['pageNumber']).toBe(2);
        expect(component['searchTerm']).toBe('test');
        expect(component['filters']).toEqual([]);
        expect(loadDataSpy).toHaveBeenCalled();
    });
});