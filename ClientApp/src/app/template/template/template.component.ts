import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { EntityDataService } from 'src/app/angular-app-services/entity-data.service';
import { LayoutService } from 'src/app/angular-app-services/layout.service';
import { DEFAULT_PAGESIZE, _camelCase } from 'src/app/library/utils';
import { Option } from '../dynamic-layout/layout-models';
import { FormControl, FormGroup } from '@angular/forms';
import { IDataState } from '../tempale-list/idata-state.interface';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrl: './template.component.scss'
})
export class TemplateComponent implements OnInit, OnDestroy {
  entityName: string = '';
  fieldOptions: { [key: string]: Option[]; } = {};
  filterFields: any[] = [];
  form?: FormGroup;
  isLoading: boolean = false;
  isLoadMore: boolean = true;
  mappedListData: any[] = [];
  mappedPreviewData: any[] = [];
  selectedId: string = '';
  selectedIndex: number | null = null;

  private destroy = new Subject();
  private editLayout: any[] = [];
  private filterLayout: any;
  private filters: any[] = [];
  private listLayout: any;
  private pageNumber: number = 1;
  private pageSize: number = DEFAULT_PAGESIZE;
  private records: any[] = [];
  private searchTerm: string = '';
  private sortField: string = '';
  private sortOrder: string = 'asc';

  constructor(
    private entityDataService: EntityDataService,
    private layoutService: LayoutService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getEntityName();
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

  public onLoadNext(emitedData: IDataState): void {
    this.pageNumber = emitedData.pageNumber;
    this.searchTerm = emitedData.searchTerm;
    this.filters = emitedData.filter;
    if (this.pageNumber === 1) {
      this.onRefreshData();
    }
    this.loadData();
  }

  public onRefreshData(): void {
    this.records = [];
    this.mappedListData = [];
    this.mappedPreviewData = [];
  }

  public onFilterChange(filters: any[] = [], selectedId: string = ''): void {
    this.selectedId = selectedId;
    this.records = [];
    this.mappedListData = [];
    this.mappedPreviewData = [];
    this.filters = filters;
    this.pageNumber = 1;
    this.loadData();
  }

  public onRefresh(): void {
    this.onFilterChange([], this.selectedId);
  }

  public previewRecord(index: number): void {
    if (this.records?.length > index) {
      this.mapPreviewData(this.records[index]);
    }
  }

  private getEntityName(): void {
    this.route.params
      .pipe(takeUntil(this.destroy))
      .subscribe(params => {
        this.entityName = params['entityName'];
        this.selectedIndex = null;
        this.resetData();
        this.getList();
      });
  }

  private getFormattedData(record: any, fieldInfo: any): any {
    if (!fieldInfo?.dataType || !fieldInfo?.fieldName || !record) return '';
    const fieldName = _camelCase(fieldInfo.fieldName),
      data = record[fieldName] || '';
    switch (fieldInfo.dataType.toLowerCase()) {
      case 'datetime': {
        const date = Date.parse(data + 'Z');
        return isNaN(date) ? data : new Date(data + 'Z').toLocaleDateString();
      }
      case 'numeric':
        return record[fieldName] !== undefined && record[fieldName] !== null ? new Intl.NumberFormat().format(Number(data)) : '';
      case 'boolean':
        return data ? 'Yes' : 'No';
      case 'guid': {
        const refProp = `${fieldName}_${fieldInfo.entityName}`.toLowerCase(),
          refPropertyName = record[refProp] || Object.keys(record)?.find(o => o.toLowerCase() === refProp),
          refObject = refPropertyName ? record[refPropertyName] : null;
        return refObject?.name || this.getRefData(refObject?.$ref, this.records)?.name || data;
      }
      default:
        return data;
    }
  }

  private getList(): void {
    this.resetData();
    const apis = [
      this.layoutService.getLayout(this.entityName, 'List'),
      this.layoutService.getLayout(this.entityName, 'Edit')
    ];
    forkJoin(apis)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: ([listLayout, editLayout]) => {

          this.editLayout = editLayout;
          this.listLayout = listLayout?.grid;
          this.filterLayout = listLayout?.filter;
          this.sortField = this.listLayout?.cardTitle?.fields?.[0]?.fieldName ?? '';
          this.prepareFilterFields();
          this.loadData();
        }
      });
  }

  private getRefData(ref: string, records: any): any {
    if (Array.isArray(records)) {
      for (const record of records) {
        if (typeof record === 'object') {
          const val = this.getRefData(ref, record);
          if (val) return val;
        }
      }
    } else {
      for (const [key, value] of Object.entries(records)) {
        if (key === '$id' && value === ref) {
          return records;
        } else if (typeof value === 'object') {
          const val = this.getRefData(ref, value);
          if (val) return val;
        }
      }
    }
  }

  private loadData(): void {
    this.isLoading = true;
    this.entityDataService.getRecords(this.entityName, this.filters, this.searchTerm, this.pageNumber, this.pageSize, this.sortField, this.sortOrder)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (records) => {
          this.isLoadMore = this.pageSize === records.length;

          if (!Array.isArray(this.records))
            this.records = [];

          if (records?.length > 0) {
            records.forEach(record => {
              this.records.push(record);
            });
          }

          this.prepareMappedData();

          const selectedRecordIndex = this.records?.findIndex(x => x.id === this.selectedId) || -1;
          this.selectedIndex = selectedRecordIndex > -1 ? selectedRecordIndex : 0;
          this.mapPreviewData(this.records?.[this.selectedIndex]);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  private mapPreviewData(record: any): void {
    if (record && this.editLayout) {
      this.selectedId = record.id;
      this.mappedPreviewData = this.mapPreviewRecursive(this.editLayout, record);
    }
    else {
      this.selectedId = '';
      this.mappedPreviewData = [];
    }
  }

  private mapPreviewRecursive(layout: any[], record: any): any {
    return layout?.map(node => {
      return {
        id: record.id,
        ...node,
        fields: node.fields ? this.mapPreviewRecursive(node.fields, record) : [],
        value: node.fieldName ? this.getFormattedData(record, node) : ''
      };
    });
  }

  private prepareFilterFields(): void {
    this.filterFields = [];
    this.form = new FormGroup({});
    if (this.filterLayout) {
      this.filterFields = this.filterLayout.fields;
    }

    this.filterFields.forEach(field => {
      const value = field.dataType.toLowerCase() === 'boolean' ? false : '';
      this.form?.addControl(field.fieldName, new FormControl(value));
      if (field.dataType?.toLowerCase() === 'guid') {
        this.form?.addControl(field.fieldName + '_search', new FormControl(value));
        if (!this.fieldOptions[field.fieldName]) {
          this.fieldOptions[field.fieldName] = [];
        }
      }
    });
  }

  private prepareMappedData(): void {
    if (this.records?.length > 0 && this.listLayout) {
      this.mappedListData = this.records.map(record => {
        const titles = this.listLayout.cardTitle?.fields?.map(
          (title: any) => {
            return {
              label: title.label,
              showInitialCharacter: title.showInitialCharacter,
              value: this.getFormattedData(record, title)
            };
          }) || [],
          details = this.listLayout.cardDetail?.fields?.map(
            (detail: any) => {
              return {
                label: detail.label,
                icon: detail.icon,
                column: detail.column,
                value: this.getFormattedData(record, detail)
              };
            }) || [];
        return {
          id: record.id,
          cardTitle: titles ? { fields: titles } : null,
          cardDetail: details ? { fields: details } : null
        };
      });
    }
    else
      this.mappedListData = [];
  }

  private resetData(): void {
    this.records = [];
    this.isLoadMore = true;
    this.mappedListData = [];
    this.selectedIndex = 0;
    this.selectedId = '';
    this.pageNumber = 1;
    this.searchTerm = '';
    this.editLayout = [];
    this.listLayout = undefined;
    this.filterFields = [];
    this.filters = [];
    this.mappedPreviewData = [];
  }
}
