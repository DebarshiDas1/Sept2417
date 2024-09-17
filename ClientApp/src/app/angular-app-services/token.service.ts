import { Injectable, NgZone } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { DecodedJwtPayload, User } from '../auth/user';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    public tokenGettingRefreshed: boolean = false;

    private user!: User;

    constructor(private router: Router, private ngZone: NgZone) { }

    public getRefreshToken(): string | null {
        const loginResponse = this.getToken();
        return loginResponse ? loginResponse.refreshToken : null;
    }

    public getTokenInfo(): any {
        const data = { value: '', isRemember: false };
        const token = this.getLoginToken();
        if (token) {
            data.value = token;
            data.isRemember = true;
        }
        return data;
    }

    public getUserDetails(): User {
        const token = this.getTokenInfo().value;
        if (token) {
            const decoded = jwtDecode<DecodedJwtPayload>(token);
            this.user = {
                name: decoded.name,
                email: decoded.email
            };
            return this.user;
        }
        return new User('', '');
    }

    public logout(): void {
        localStorage.removeItem('token');
        this.ngZone.run(() => {
            this.router.navigate(['']).then(() => window.location.reload());
        });
    }

    public isAuthTokenExpired(token?: string): boolean {
        if (!token) { token = this.getTokenInfo().value; }
        if (!token) { return true; }
        const date = this.getTokenExpirationDate(token);
        if (date === undefined) { return false; }
        return date.valueOf() <= new Date().valueOf();
    }

    public isRefreshTokenExpired(token?: string): boolean {
        if (!token) { token = this.getRefreshToken()!; }
        if (!token) { return true; }
        const date = this.getTokenExpirationDate(token);
        if (date === undefined) { return true; }
        const retVal = date.valueOf() <= new Date().valueOf();
        return retVal;
    }

    public setToken(token: any): void {
        localStorage.setItem('token', JSON.stringify(token));
    }

    private getLoginToken(): string | null {
        const loginResponse = this.getToken();
        return loginResponse ? loginResponse.token : null;
    }

    private getToken(): any {
        const token = localStorage.getItem('token');
        return token ? JSON.parse(token) : null;
    }

    private getTokenExpirationDate(token: string): Date {
        const decoded = jwtDecode(token);
        if (decoded['exp'] === undefined) {
            return new Date(0); // return default date if exp is undefined
        }
        const date = new Date(0);
        date.setUTCSeconds(decoded['exp']);
        return date;
    }
}
