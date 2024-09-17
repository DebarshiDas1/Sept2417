import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { EntityDataService } from 'src/app/angular-app-services/entity-data.service';
import { LayoutService } from 'src/app/angular-app-services/layout.service';
import { Option } from '../dynamic-layout/layout-models';
import { SweetAlertService } from 'src/app/angular-app-services/sweet-alert.service';
import { _camelCase, _camelToSentenceCase, _toSentenceCase } from 'src/app/library/utils';

@Component({
  selector: 'app-template-add',
  templateUrl: './template-add.component.html',
  styleUrl: './template-add.component.scss'
})
export class TemplateAddComponent implements OnInit, OnDestroy {
  @Input() entityName: string = '';
  @Input() id: string = '';
  @Output() saved = new EventEmitter<boolean>();

  public entityDisplayName: string = '';
  public fieldOptions: { [key: string]: Option[]; } = {};
  public form?: FormGroup;
  public layoutData: any[] = [];

  private destroy = new Subject();

  constructor(
    private dialogRef: MatDialogRef<TemplateAddComponent>,
    private entityDataService: EntityDataService,
    private layoutService: LayoutService,
    private sweetAlertService: SweetAlertService,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.entityDisplayName = _camelToSentenceCase(this.entityName);
    this.getLayout(this.entityName, this.id ? 'Edit' : 'Add');
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

  closeDialog(status: boolean = false): void {
    this.dialogRef.close(status);
  }

  onSubmit(): void {
    const isValid = this.formValidation();
    if (!isValid) return;
    const data = this.form?.value;
    if (this.id) {
      data.id = this.id;
    }
    const apiCall = this.id ? this.entityDataService.editRecordById(this.entityName, this.id, data) : this.entityDataService.addRecord(this.entityName, data);
    apiCall?.pipe(takeUntil(this.destroy))
      .subscribe({
        next: data => {
          if (data) {
            this.sweetAlertService.showSuccess(`${_toSentenceCase(_camelToSentenceCase(this.entityName))} has been ${this.id ? 'updated' : 'added'}.`);
            this.saved.emit(true);
          }
        }
      });
  }

  private formValidation(): boolean {
    if (!this.form?.valid) {
      for (const hasErrorIn in this.form?.controls) {
        if (this.form.controls[hasErrorIn].errors) {
          this.renderer?.selectRootElement(`#${hasErrorIn}`)?.focus();
          return false;
        }
      }
    }
    return true;
  }

  private getDefaultValue(field: any): any {
    switch (field.dataType.toLowerCase()) {
      case 'numeric':
      case 'guid':
      case 'date':
      case 'datetime':
        return null;
      case 'boolean':
        return false;
      default:
        return '';
    }
  }

  private getLayout(entityName: string, fileName: string): void {
    this.layoutService.getLayout(entityName, fileName)
      ?.pipe(takeUntil(this.destroy))
      .subscribe({
        next: data => {
          this.layoutData = data;
          if (this.id) {
            this.getRecord(this.id);
          } else {
            this.form = new FormGroup({});
            this.initializeForm(data);
            this.getOptions(null);
          }
        }
      });
  }

  private getOptions(data: any): void {
    this.form?.patchValue(data);
  }

  private getRecord(id: string): void {
    const fields = this.entityDataService.getFields(this.layoutData);
    this.entityDataService.getRecordById(this.entityName, id, fields)
      ?.pipe(takeUntil(this.destroy))
      .subscribe({
        next: data => {
          this.form = new FormGroup({});
          this.initializeForm(this.layoutData, data);
          this.getOptions(data);
        }
      });
  }

  private initializeForm(fields: any[], data?: any) {
    // Loop through the fields and add form controls
    fields.forEach(field => {
      if (field.dataType === 'section') {
        this.initializeForm(field.fields, data);
      } else {
        field.fieldName = _camelCase(field.fieldName);
        const defaultValue = this.getDefaultValue(field),
          validators: any[] = [];
        if (
          (typeof field.required === 'boolean' && field.required) ||
          (typeof field.required === 'string' && field.required.toLowerCase() === 'true')
        ) {
          validators.push(Validators.required);
          field.required = true;
        } else {
          field.required = false;
        }

        if (field.dataType.toLowerCase() === 'numeric') {
          if (field.scale) {
            const scale = parseInt(field.scale),
              regEx = RegExp('^-?[0-9]+(\\.[0-9]{0,' + scale + '}){0,1}$');
            validators.push(Validators.pattern(regEx));
          } else {
            validators.push(Validators.pattern(/^-?\d+$/));
          }
        }

        if ((field.dataType.toLowerCase() === 'datetime' || field.dataType.toLowerCase() === 'date') && data?.[field.fieldName]) {
          const date = Date.parse(data[field.fieldName] + 'Z'),
            localDate = isNaN(date) ? date : new Date(data[field.fieldName] + 'Z');
          data[field.fieldName] = localDate;
        }

        this.form?.addControl(field.fieldName, new FormControl(defaultValue, validators));
        if (field.dataType?.toLowerCase() === 'guid') {
          this.form?.addControl(field.fieldName + '_search', new FormControl(''));
          if (!this.fieldOptions[field.fieldName]) {
            this.fieldOptions[field.fieldName] = [];
          }
        }
      }
    });
  }
}
