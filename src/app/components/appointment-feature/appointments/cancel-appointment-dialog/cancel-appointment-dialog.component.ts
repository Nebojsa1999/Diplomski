import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Appointment } from '../../../../rest/hospital/hospital.model';

export interface CancelAppointmentDialogData {
    appointment: Appointment;
}

@Component({
    selector: 'app-cancel-appointment-dialog',
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, TranslateModule],
    templateUrl: './cancel-appointment-dialog.component.html',
    styleUrl: './cancel-appointment-dialog.component.scss',
})
export class CancelAppointmentDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<CancelAppointmentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CancelAppointmentDialogData
    ) {}

    confirm(): void {
        this.dialogRef.close(true);
    }

    dismiss(): void {
        this.dialogRef.close(false);
    }
}
