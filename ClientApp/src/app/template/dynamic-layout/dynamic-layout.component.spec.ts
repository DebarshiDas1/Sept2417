import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicLayoutComponent } from './dynamic-layout.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EntityDataService } from 'src/app/angular-app-services/entity-data.service';
import { TooltipService } from 'src/app/angular-app-services/tooltip.service';
import { of } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

describe('DynamicLayoutComponent', () => {
  let component: DynamicLayoutComponent;
  let fixture: ComponentFixture<DynamicLayoutComponent>;
  let entityDataServiceMock: jasmine.SpyObj<EntityDataService>;
  let tooltipServiceMock: jasmine.SpyObj<TooltipService>;

  beforeEach(() => {
    entityDataServiceMock = jasmine.createSpyObj('EntityDataService', ['getRecords']);
    tooltipServiceMock = jasmine.createSpyObj('TooltipService', ['isTooltipDisabled']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DynamicLayoutComponent],
      providers: [
        { provide: EntityDataService, useValue: entityDataServiceMock },
        { provide: TooltipService, useValue: tooltipServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(DynamicLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should initialize dropdowns with data from service', () => {
    const mockData = [{ id: '1', name: 'Option 1' }, { id: '2', name: 'Option 2' }];
    entityDataServiceMock.getRecords.and.returnValue(of(mockData));

    component.formFields = [{ fieldName: 'field1', dataType: 'guid', entityName: 'entity1' }];
    component.form = new FormGroup({ field1: new FormControl('1') });

    fixture.detectChanges();
    expect(component.fieldOptions['field1']).toEqual([
      { value: '1', text: 'Option 1' },
      { value: '2', text: 'Option 2' }
    ]);
  });

  it('should disable tooltip if service returns true', () => {
    const mockElement = document.createElement('div');
    tooltipServiceMock.isTooltipDisabled.and.returnValue(true);

    const result = component.isTooltipDisabled(mockElement);
    expect(result).toBeTrue();
    expect(tooltipServiceMock.isTooltipDisabled).toHaveBeenCalledWith(mockElement);
  });
});
