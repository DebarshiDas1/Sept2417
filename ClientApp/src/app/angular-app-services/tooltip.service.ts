import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TooltipService {
    public isTooltipDisabled(element: HTMLElement): boolean {
        return element.scrollWidth <= element.clientWidth;
    }
}