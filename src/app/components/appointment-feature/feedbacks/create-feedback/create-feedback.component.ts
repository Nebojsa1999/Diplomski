import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { shared } from "../../../../app.config";
import { ApiService } from "../../../../common/service/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { catchError, of } from "rxjs";
import { NotificationService } from "../../../../common/service/notification.service";
import { ROUTE_APPOINTMENTS } from "../../appointments/list-appointments/list-appointments.component";

export const ROUTE_CREATE_FEEDBACK = 'create-feedback';

@Component({
    selector: 'app-create-feedback',
    imports: [
        shared
    ],
    templateUrl: './create-feedback.component.html',
    styleUrl: './create-feedback.component.scss',
})
export class CreateFeedbackComponent {
    form = new FormGroup({
        grade: new FormControl<number>(1, [Validators.required]),
        comment: new FormControl<string | null>(null, [Validators.required]),
    });

    grades: number[] = [1, 2, 3, 4, 5]
    readOnly: boolean = false;

    constructor(private apiService: ApiService,
                private route: ActivatedRoute,
                private notificationService: NotificationService,
                private router: Router) {

        this.apiService.appointmentApi.getFeedback(this.route.snapshot.params['id']).pipe(
            map(response => response.data),
            catchError(error => of(null))
        ).subscribe((response)=> {
            if (response) {
                this.form.get('grade')?.setValue(response.grade)
                this.form.get('comment')?.setValue(response.comment)
                this.readOnly = true;
            }
        })
    }

    setRating(value: number) {
        this.form.get('grade')?.setValue(value)
    }

    onSubmit() {
        const grade = this.form.get('grade')?.value;
        const comment = this.form.get('comment')?.value;

        this.apiService.appointmentApi.submitFeedback(this.route.snapshot.params['id'], {grade: grade as number, comment: comment as string}).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully submitted a feedback.');
                this.router.navigate([ROUTE_APPOINTMENTS])
            }
        });
    }
}
