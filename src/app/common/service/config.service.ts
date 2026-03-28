import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: { apiUrl: string } = { apiUrl: '' };

    constructor(private http: HttpClient) {}

    async load(): Promise<void> {
        this.config = await firstValueFrom(this.http.get<{ apiUrl: string }>('/config/config.json'));
    }

    get apiUrl(): string {
        return this.config.apiUrl;
    }
}
