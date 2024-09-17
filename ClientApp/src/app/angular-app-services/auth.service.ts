import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginInfoPayload } from '../login/login-info-payload';
import { AppConfigService } from '../app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }

  public login(credentials: LoginInfoPayload): Observable<any> {
    const url = this.route + 'login';
    return this.http.post<any>(url, credentials);
  }

  public refreshToken(refreshToken: string): Observable<any> {
    const url = this.route + 'refresh';
    return this.http.post<any>(url, { refreshToken: refreshToken });
  }

  private get route(): string {
    const baseUrl = AppConfigService.appConfig ? AppConfigService.appConfig.api.url : '';
    return `${baseUrl}/api/user-account/`;
  }
}