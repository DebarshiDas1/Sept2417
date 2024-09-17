import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MenuService } from './menu.service';

describe('MenuService', () => {
    let service: MenuService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MenuService]
        });

        service = TestBed.inject(MenuService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should get menu items', () => {
        const mockResponse = [
            { id: 1, label: 'Home', route: '/' },
            { id: 2, label: 'About', route: '/about' }
        ];

        service.getMenu().subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('/api/meta-data/menu');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should handle error when getting menu items', () => {
        const mockErrorResponse = { error: 'Internal server error' };

        service.getMenu().subscribe({
            next: () => fail('Expected an error'),
            error: (error) => {
                expect(error.error).toEqual(mockErrorResponse);
            }
        });

        const req = httpMock.expectOne('/api/meta-data/menu');
        expect(req.request.method).toBe('GET');
        req.flush(mockErrorResponse, { status: 500, statusText: 'Internal Server Error' });
    });
});
