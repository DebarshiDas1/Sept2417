import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../app-config.service';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    constructor(private http: HttpClient) { }

    public getLayout(entityName: string, fileName: string): Observable<any> {
        return this.http.get<any>(`${this.route}/${entityName}/layout?fileName=${fileName}`);
    }

    private get route(): string {
        const baseUrl = AppConfigService.appConfig ? AppConfigService.appConfig.api.url : '';
        return `${baseUrl}/api/meta-data`;
    }
}
