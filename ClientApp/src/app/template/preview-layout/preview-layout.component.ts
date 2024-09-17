import { Component, Input } from '@angular/core';
import { TooltipService } from 'src/app/angular-app-services/tooltip.service';

@Component({
    selector: 'app-preview-layout',
    templateUrl: './preview-layout.component.html',
    styleUrl: './preview-layout.component.scss'
})
export class PreviewLayoutComponent {
    @Input() mappedData: any[] = [];

    constructor(
        private tooltipService: TooltipService
    ) { }

    public getColumnClass(column: number): string {
        return `col-md-${(column && column >= 1 && column <= 12) ? column : 12}`;
    }

    public isTooltipDisabled(element: HTMLElement): boolean {
        return this.tooltipService.isTooltipDisabled(element);
    }
}