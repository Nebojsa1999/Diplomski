import { Injectable } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
    providedIn: 'root'
})
export class IconRegistryService {

    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
        matIconRegistry.addSvgIcon('check_circle', domSanitizer.bypassSecurityTrustResourceUrl('assets/images/check_circle.svg'));
        matIconRegistry.addSvgIcon('cancel', domSanitizer.bypassSecurityTrustResourceUrl('assets/images/cancel.svg'));
        matIconRegistry.addSvgIcon('edit', domSanitizer.bypassSecurityTrustResourceUrl('assets/images/edit.svg'));
        matIconRegistry.addSvgIcon('schedule', domSanitizer.bypassSecurityTrustResourceUrl('assets/images/calendar.svg'));
        matIconRegistry.addSvgIcon('file_save', domSanitizer.bypassSecurityTrustResourceUrl('assets/images/file_save.svg'));
        matIconRegistry.addSvgIcon('room', domSanitizer.bypassSecurityTrustResourceUrl('assets/images/room.svg'));
    }
}