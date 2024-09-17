import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EntityDataService } from './entity-data.service';
import { TestBed } from '@angular/core/testing';

describe('EntityDataService', () => {
    let service: EntityDataService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EntityDataService]
        });

        service = TestBed.inject(EntityDataService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('EntityDataService', () => {
        it('should get records with filters', () => {
            const entityName = 'users';
            const filters = [{ field: 'age', operator: '>', value: 30 }];
            const mockResponse = [
                { id: 1, name: 'John Doe', age: 35 },
                { id: 2, name: 'Jane Smith', age: 40 }
            ];

            service.getRecords(entityName, filters).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(req => {
                return req.method === 'GET' &&
                    req.url === `${service['route']}/${entityName}` &&
                    req.params.get('filters') === JSON.stringify(filters) &&
                    req.params.has('pageNumber') &&
                    req.params.has('pageSize');
            });

            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('should get records with search term', () => {
            const entityName = 'users';
            const searchTerm = 'john';
            const mockResponse = [{ id: 1, name: 'John Doe', age: 35 }];

            service.getRecords(entityName, [], searchTerm).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(req => {
                return req.method === 'GET' &&
                    req.url === `${service['route']}/${entityName}` &&
                    req.params.get('searchTerm') === searchTerm &&
                    req.params.has('pageNumber') &&
                    req.params.has('pageSize');
            });

            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('should get records with sorting', () => {
            const entityName = 'users';
            const sortField = 'name';
            const sortOrder = 'desc';
            const mockResponse = [
                { id: 3, name: 'Zoe Williams' },
                { id: 2, name: 'Jane Smith' },
                { id: 1, name: 'John Doe' }
            ];

            service.getRecords(entityName, [], '', 1, 10, sortField, sortOrder).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(req => {
                return req.method === 'GET' &&
                    req.url === `${service['route']}/${entityName}` &&
                    req.params.has('pageNumber') &&
                    req.params.has('pageSize') &&
                    req.params.has('sortField') &&
                    req.params.has('sortOrder');
            });

            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('should get record by id', () => {
            const entityName = 'users';
            const id = '1';
            const fields = ['name', 'age'];
            const mockResponse = { id: 1, name: 'John Doe' };

            service.getRecordById(entityName, id, fields).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(`${service['route']}/${entityName}/${id}?fields=${fields.join(',')}`);
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('should handle invalid entity name', () => {
            const entityName = 'invalidEntity';
            const id = '1';
            const fields = ['name', 'age'];
            const mockErrorResponse = { error: 'Entity not found' };

            service.getRecordById(entityName, id, fields).subscribe({
                next: () => fail('Expected an error'),
                error: (error) => {
                    expect(error.error).toEqual(mockErrorResponse);
                }
            });

            const req = httpMock.expectOne(`${service['route']}/${entityName}/${id}?fields=${fields.join(',')}`);
            expect(req.request.method).toBe('GET');
            req.flush(mockErrorResponse, { status: 404, statusText: 'Not Found' });
        });
        it('should handle invalid id', () => {
            const entityName = 'users';
            const id = 'invalid';
            const fields = ['name', 'age'];
            const mockErrorResponse = { error: 'Invalid id' };

            service.getRecordById(entityName, id, fields).subscribe({
                next: () => fail('Expected an error'),
                error: (error) => {
                    expect(error.error).toEqual(mockErrorResponse);
                }
            });

            const req = httpMock.expectOne(`${service['route']}/${entityName}/${id}?fields=${fields.join(',')}`);
            expect(req.request.method).toBe('GET');
            req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' });
        });
    });
});