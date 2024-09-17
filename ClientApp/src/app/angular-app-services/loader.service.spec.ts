import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
    let service: LoaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoaderService]
        });
        service = TestBed.inject(LoaderService);
    });

    it('should initially set loading state to false', () => {
        service.loadingSubject.subscribe(state => {
            expect(state).toBe(false);
        });
    });

    it('should set loading state to true when show is called', () => {
        service.show();
        service.loadingSubject.subscribe(state => {
            expect(state).toBe(true);
        });
    });

    it('should set loading state to false when hide is called', () => {
        service.show();
        service.hide();
        service.loadingSubject.subscribe(state => {
            expect(state).toBe(false);
        });
    });
});