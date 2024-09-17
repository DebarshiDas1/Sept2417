import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TemplateAddComponent } from '../template-add/template-add.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-template-preview',
  templateUrl: './template-preview.component.html',
  styleUrl: './template-preview.component.scss'
})
export class TemplatePreviewComponent implements OnDestroy {
  @Input() id: string = '';
  @Input() mappedData: any[] = [];
  @Input() entityName: string = '';
  @Output() refresh = new EventEmitter<void>();

  private destroy = new Subject();

  constructor(
    protected dialog: MatDialog
  ) {
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
    this.destroy.next(true);
    this.destroy.complete();
  }

  editRecord(): void {
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
    dialog.componentInstance.id = this.id;
    dialog.componentInstance.saved
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (status) => {
          dialog.close();
          if (status) {
            this.refresh.emit();
          }
        }
      });
  }
}
