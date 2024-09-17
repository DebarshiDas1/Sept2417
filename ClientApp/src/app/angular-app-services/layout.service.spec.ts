import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LayoutService } from './layout.service';

describe('LayoutService', () => {
    let service: LayoutService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LayoutService]
        });

        service = TestBed.inject(LayoutService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should get layout for entity and layout type', () => {
        const entityName = 'users';
        const layoutType = 'grid';
        const mockResponse = { columns: ['name', 'age'] };

        service.getLayout(entityName, layoutType).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(req => {
            return req.method === 'GET' &&
                req.url === `${service['route']}/${entityName}/layout?fileName=${layoutType}`;
        });

        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should handle invalid entity name', () => {
        const entityName = 'invalidEntity';
        const layoutType = 'grid';
        const mockErrorResponse = { error: 'Entity not found' };

        service.getLayout(entityName, layoutType).subscribe({
            next: () => fail('Expected an error'),
            error: (error) => {
                expect(error.error).toEqual(mockErrorResponse);
            }
        });

        const req = httpMock.expectOne(req => {
            return req.method === 'GET' &&
                req.url === `${service['route']}/${entityName}/layout?fileName=${layoutType}`;
        });

        expect(req.request.method).toBe('GET');
        req.flush(mockErrorResponse, { status: 404, statusText: 'Not Found' });
    });

    it('should handle invalid layout type', () => {
        const entityName = 'users';
        const layoutType = 'invalidLayout';
        const mockErrorResponse = { error: 'Invalid layout type' };

        service.getLayout(entityName, layoutType).subscribe({
            next: () => fail('Expected an error'),
            error: (error) => {
                expect(error.error).toEqual(mockErrorResponse);
            }
        });

        const req = httpMock.expectOne(req => {
            return req.method === 'GET' &&
                req.url === `${service['route']}/${entityName}/layout?fileName=${layoutType}`;
        });

        expect(req.request.method).toBe('GET');
        req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle server error', () => {
        const entityName = 'users';
        const layoutType = 'grid';
        const mockErrorResponse = { error: 'Internal server error' };

        service.getLayout(entityName, layoutType).subscribe({
            next: () => fail('Expected an error'),
            error: (error) => {
                expect(error.error).toEqual(mockErrorResponse);
            }
        });

        const req = httpMock.expectOne(req => {
            return req.method === 'GET' &&
                req.url === `${service['route']}/${entityName}/layout?fileName=${layoutType}`;
        });

        expect(req.request.method).toBe('GET');
        req.flush(mockErrorResponse, { status: 500, statusText: 'Internal Server Error' });
    });
});
