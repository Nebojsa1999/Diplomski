import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { of } from "rxjs";

@Injectable({providedIn: 'root'})
export class NotificationService {

    constructor(private snackBar: MatSnackBar) {
    }

    showInfo(message: string, duration = 2000) {
        this.showNotification('snackbar-info', (message), duration);
    }

    showSuccess(message: string, duration = 2000) {
        this.showNotification('snackbar-success', (message), duration);
    }

    showWarning(message: string, duration = 2000) {
        this.showNotification('snackbar-warning', (message), duration);
    }

    showError(error?: any, duration = 3000) {
        const errorDetails = !error ? '' : ': ' + error.message;
        this.showNotification('snackbar-error', errorDetails, duration);
        return of(null);
    }

    private showNotification(panelClass: string, message: string, duration: number) {
        this.snackBar.open(message, '', {duration, panelClass});
    }
}
