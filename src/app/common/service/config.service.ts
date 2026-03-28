import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: { apiUrl: string } = { apiUrl: '' };

    async load(): Promise<void> {
        const response = await fetch('/config/config.json');
        this.config = await response.json();
    }

    get apiUrl(): string {
        return this.config.apiUrl;
    }
}
