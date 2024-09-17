import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
    let service: TokenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TokenService]
        });
        service = TestBed.inject(TokenService);
    });

    it('should set and get access token', () => {
        const accessToken = 'test-access-token';
        service.setToken(accessToken);
        expect(service.getTokenInfo().value).not.toBe(accessToken);
    });
});