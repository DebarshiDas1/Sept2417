import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private http: HttpClient) { }

  public getMenu(): Observable<any> {
    return this.http.get<any>(this.route);
  }

  private get route(): string {
    const baseUrl = AppConfigService.appConfig ? AppConfigService.appConfig.api.url : '';
    return `${baseUrl}/api/meta-data/menu`;
  }
}
