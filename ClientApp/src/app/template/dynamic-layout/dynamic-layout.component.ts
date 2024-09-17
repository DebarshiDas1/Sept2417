import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Option } from './layout-models';
import { TooltipService } from 'src/app/angular-app-services/tooltip.service';
import { Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { EntityDataService } from 'src/app/angular-app-services/entity-data.service';
import { DEFAULT_PAGESIZE } from 'src/app/library/utils';

@Component({
  selector: 'app-dynamic-layout',
  templateUrl: './dynamic-layout.component.html',
  styleUrl: './dynamic-layout.component.scss'
})
export class DynamicLayoutComponent implements OnInit, OnDestroy {
  @Input() fieldOptions: { [key: string]: Option[]; } = {};
  @Input() form!: FormGroup;
  @Input() formFields!: any[];

  public isDropDownLoading: boolean = false;

  private destroy = new Subject();
  private readonly pageNumber: number = 1;
  private readonly pageSize: number = DEFAULT_PAGESIZE;
  private readonly sortField: string = 'name';
  private readonly sortOrder: string = 'asc';

  constructor(
    private entityDataService: EntityDataService,
    private tooltipService: TooltipService
  ) { }

  ngOnInit(): void {
    this.initializeDropDownFields();
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

  public isTooltipDisabled(element: HTMLElement): boolean {
    return this.tooltipService.isTooltipDisabled(element);
  }

  private getOptions(entityName: string, fieldName: string, searchTerm: any, isUserInput: boolean): void {
    this.isDropDownLoading = true;
    const api = !isUserInput
      ? this.entityDataService.getRecords(entityName, [{ PropertyName: 'id', Operator: 'Equals', Value: searchTerm }], '', this.pageNumber, this.pageSize, this.sortField, this.sortOrder)
      : this.entityDataService.getRecords(entityName, [], searchTerm, this.pageNumber, this.pageSize, this.sortField, this.sortOrder);

    api.pipe(takeUntil(this.destroy))
      .subscribe({
        next: (data) => {
          this.fieldOptions[fieldName] = data?.map(item => { return { value: item.id, text: item.name } as Option; });
        },
        complete: () => {
          this.isDropDownLoading = false;
        }
      });
  }

  private initializeDropDownFields(): void {
    const guidFields = this.formFields?.filter(field => field.dataType?.toLowerCase() === 'guid');
    guidFields?.forEach(field => {
      this.form.get(field.fieldName + '_search')?.valueChanges
        .pipe(
          filter(search => { this.isDropDownLoading = true; return !!search; }),
          distinctUntilChanged(),
          takeUntil(this.destroy),
          debounceTime(400),
          delay(100),
          takeUntil(this.destroy)
        ).subscribe({
          next: (search) => {
            this.getOptions(field.entityName, field.fieldName, search, true);
          }
        });
    });
    const guidData = guidFields?.filter(field => this.form.get(field.fieldName)?.value);
    guidData?.map(field => { return this.getOptions(field.entityName, field.fieldName, this.form.get(field.fieldName)?.value, false); });
  }
}
