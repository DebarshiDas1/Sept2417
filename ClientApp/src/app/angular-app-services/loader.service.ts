import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    public loadingSubject = new BehaviorSubject<boolean>(false);

    public hide(): void {
        this.loadingSubject.next(false);
    }

    public show(): void {
        this.loadingSubject.next(true);
    }
}