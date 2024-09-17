import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { LoginInfoPayload } from '../login/login-info-payload';
import { HttpErrorResponse } from '@angular/common/http';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should login with valid credentials', () => {
        const credentials: LoginInfoPayload = {
            userName: 'testuser',
            password: 'testpassword'
        };
        const mockResponse = { token: 'mocktoken' };

        service.login(credentials).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${service['route']}login`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(credentials);
        req.flush(mockResponse);
    });

    it('should refresh token with valid refresh token', () => {
        const refreshToken = 'mockrefreshtoken';
        const mockResponse = { token: 'newmocktoken' };

        service.refreshToken(refreshToken).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${service['route']}refresh`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ refreshToken });
        req.flush(mockResponse);
    });

    it('should handle invalid refresh token', () => {
        const refreshToken = 'invalidrefreshtoken';
        const mockErrorResponse = { error: 'Invalid refresh token' };

        service.refreshToken(refreshToken).subscribe({
            next: () => fail('Expected an error'),
            error: (error: HttpErrorResponse) => {
                expect(error.error).toEqual(mockErrorResponse);
                expect(error.status).toBe(400);
                expect(error.statusText).toBe('Bad Request');
            }
        });

        const req = httpMock.expectOne(`${service['route']}refresh`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ refreshToken });
        req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' });
    });

});
