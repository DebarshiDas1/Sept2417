import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TemplateAddComponent } from '../template-add/template-add.component';
import { MatDialog } from '@angular/material/dialog';
import { EntityDataService } from 'src/app/angular-app-services/entity-data.service';
import { Subject, debounceTime, delay, distinctUntilChanged, filter, takeUntil } from 'rxjs';
import { SweetAlertService } from 'src/app/angular-app-services/sweet-alert.service';
import { DEFAULT_PAGESIZE, RegExGuid, _camelToSentenceCase, _toSentenceCase } from 'src/app/library/utils';
import { Option } from '../dynamic-layout/layout-models';
import { FormGroup } from '@angular/forms';
import { IDataState } from './idata-state.interface';
import { TooltipService } from 'src/app/angular-app-services/tooltip.service';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.scss'
})
export class TemplateListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() entityName: string = '';
  @Input() fieldOptions: { [key: string]: Option[]; } = {};
  @Input() filterFields: any[] = [];
  @Input() form?: FormGroup;
  @Input() isLoading: boolean = false;
  @Input() isLoadMore: boolean = false;
  @Input() mappedData: any[] = [];
  @Input() selectedIndex: number | null = 0;

  @Output() previewRecord = new EventEmitter<number>();
  @Output() refresh = new EventEmitter<IDataState>();

  @ViewChild('scrollWrapper') scrollWrapper: any;

  public entityDisplayName: string = '';
  public filterData: any[] = [];
  public isDropDownLoading: boolean = false;
  public searchTerm: string = '';
  public sentenceCaseEntityName: string = '';
  public showFilterPanel: boolean = false;

  private destroy = new Subject();
  private filter: any[] = [];
  private pageNumber: number = 1;
  private pageSize = DEFAULT_PAGESIZE;
  private readonly sortField: string = 'name';
  private readonly sortOrder: string = 'asc';

  constructor(
    private dialog: MatDialog,
    private entityDataService: EntityDataService,
    private sweetAlertService: SweetAlertService,
    private tooltipService: TooltipService
  ) {
  }

  ngOnInit(): void {
    this.sentenceCaseEntityName = _toSentenceCase(_camelToSentenceCase(this.entityName));
    this.entityDisplayName = _camelToSentenceCase(this.entityName);
    this.initializeDropDownFields();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entityName']) {
      this.clearAll();
      this.sentenceCaseEntityName = _toSentenceCase(_camelToSentenceCase(this.entityName));
      this.entityDisplayName = _camelToSentenceCase(this.entityName);
      this.initializeDropDownFields();
    }
    if (changes['filterFields']) {
      this.initializeDropDownFields();
    }
    setTimeout(() => {
      const inline: ScrollIntoViewOptions = { inline: 'center' };
      if (this.mappedData?.length > 0) {
        const newRecordIndex = (this.pageNumber - 1) * this.pageSize,
          scrollToIndex = this.mappedData.length - 1 > newRecordIndex ? newRecordIndex : this.mappedData.length - 1,
          selectedDiv = document.getElementById('div-' + (scrollToIndex)) as HTMLElement;
        selectedDiv?.scrollIntoView(inline);
      }
    }, 100);
    this.generateRandomClasses();
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
    this.destroy.next(true);
    this.destroy.complete();
  }

  public addRecord(): void {
    const dialog = this.dialog.open(TemplateAddComponent, {
      width: '73vw',
      height: '100vh',
      position: {
        top: '0px',
        right: '0px',
      },
      panelClass: [
        'animate__animated',
        'animate__slideInRight',
        'no-border-wrapper',
      ],
      autoFocus: false,
      disableClose: true
    });
    dialog.componentInstance.entityName = this.entityName;
    dialog.componentInstance.id = '';
    dialog.componentInstance.saved
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (status) => {
          dialog.close();
          if (status) {
            this.pageNumber = 1;
            this.setRefreshData();
          }
        }
      });
  }

  public clearAll(): boolean {
    this.form?.reset();
    this.searchTerm = '';
    this.filter = [];
    this.filterData = [];
    this.pageNumber = 1;
    return true;
  }

  public clearSpecificFilter(key: string): void {
    this.form?.get(key)?.setValue(null);
    this.form?.get(key)?.updateValueAndValidity();
    this.filterData = this.filterData.filter(x => x.key !== key);
    this.onSearch();
  }

  public async confirmDelete(id: string): Promise<void> {
    const confirmed = await this.sweetAlertService.showDeleteConfirmationDialog();

    if (confirmed) {
      this.deleteData(id);
    }
  }

  public editRecordById(id: string): void {
    const dialog = this.dialog.open(TemplateAddComponent, {
      width: '73vw',
      height: '100vh',
      position: {
        top: '0px',
        right: '0px',
      },
      panelClass: [
        'animate__animated',
        'animate__slideInRight',
        'no-border-wrapper',
      ],
      autoFocus: false,
      disableClose: true
    });
    dialog.componentInstance.entityName = this.entityName;
    dialog.componentInstance.id = id;
    dialog.componentInstance.saved
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (status) => {
          dialog.close();
          if (status) {
            this.form?.reset();
            this.filterData = [];
            this.pageNumber = 1;
            this.setRefreshData();
          }
        }
      });
  }

  private generateRandomClasses(): void {
    const numClasses = 9,
      classes = Array.from({ length: numClasses }, (_, index) => `color-${index + 1}`);
    this.mappedData.forEach(record => {
      const randomIndex = Math.floor(Math.random() * classes.length);
      record.randomClass = classes[randomIndex];
    });
  }

  public getRandomClass(record: any): string {
    return record.randomClass;
  }

  public truncateText(text: string): string {
    const maxLength = 130;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  public isTooltipDisabled(element: HTMLElement): boolean {
    return this.tooltipService.isTooltipDisabled(element);
  }

  public onEnterPressed(): void {
    this.pageNumber = 1;
    this.setRefreshData();
  }

  public onLoadButtonClick(): void {
    this.pageNumber += 1;
    this.setRefreshData();
  }

  public onSearch(): void {
    this.filter = [];

    this.filterData = [];
    for (const [key, value] of Object.entries(this.form?.value) as [string, any]) {
      if (value !== undefined && value !== null && value !== '' && value !== false) {
        let maskedValue = `${value}`,
          visibleText = maskedValue;
        if (typeof value.getMonth === 'function') {
          maskedValue = value.toISOString();
          visibleText = value.toLocaleDateString();
        } else if (typeof value === 'boolean') {
          visibleText = `${this.filterFields.find(o => o.fieldName === key)?.label || key}: ${value ? 'Yes' : 'No'}`;
        } else if (RegExGuid.test(value)) {
          visibleText = this.fieldOptions[key]?.find(x => x.value === value)?.text ?? maskedValue;
        }
        this.filter.push({ PropertyName: key, Operator: 'equals', Value: maskedValue });
        this.filterData.push({ key: key, value: visibleText });
      }
    }
    this.selectedIndex = 0;
    this.pageNumber = 1;
    this.setRefreshData();
    this.showFilterPanel = false;
  }

  public onScroll(): void {
    const { scrollTop, scrollHeight, clientHeight } = this.scrollWrapper.nativeElement,
      result = scrollHeight - scrollTop - clientHeight;
    if ((result < 1 && result >= 0) && scrollTop > 0 && this.isLoadMore) {
      this.pageNumber += 1;
      this.setRefreshData();
    }
  }

  public previewSpecificRecord(index: number): void {
    this.selectedIndex = index;
    this.previewRecord.emit(index);
  }

  private deleteData(id: string): void {
    this.entityDataService.deleteRecordById(this.entityName, id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.pageNumber = 1;
          this.setRefreshData();
          this.sweetAlertService.showSuccess(this.sentenceCaseEntityName + ' has been deleted.');
        }
      });
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
    const guidFields = this.filterFields?.filter(field => field.dataType?.toLowerCase() === 'guid');
    guidFields?.forEach(field => {
      this.form?.get(field.fieldName + '_search')?.valueChanges
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
    const guidData = guidFields?.filter(field => this.form?.get(field.fieldName)?.value);
    guidData?.map(field => { return this.getOptions(field.entityName, field.fieldName, this.form?.get(field.fieldName)?.value, false); });
  }

  private setRefreshData(): void {
    const refreshData = {
      pageNumber: this.pageNumber,
      searchTerm: this.searchTerm,
      filter: this.filter
    };

    this.refresh.emit(refreshData);
  }
}