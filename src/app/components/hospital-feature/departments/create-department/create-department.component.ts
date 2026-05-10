import {ChangeDetectorRef, Component} from '@angular/core';
import {shared} from "../../../../app.config";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Hospital} from "../../../../rest/hospital/hospital.model";
import {ApiService} from "../../../../common/service/api.service";
import {catchError} from "rxjs";
import {map} from "rxjs/operators";
import {NotificationService} from "../../../../common/service/notification.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {AuthenticationService} from "../../../../common/service/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ROUTE_DEPARTMENTS} from "../list-departments/list-departments.component";
import {ROUTE_HOSPITAL} from "../../hospitals/upsert-hospital/hospital.component";

export const ROUTE_CREATE_DEPARTMENT = 'create-department';

@Component({
    selector: 'app-create-department',
    imports: [shared],
    templateUrl: './create-department.component.html',
    styleUrl: './create-department.component.scss',
})
export class CreateDepartmentComponent {
    form = new FormGroup({
        name: new FormControl<string | null>('', [Validators.required]),
        description: new FormControl<string | null>(null),
        phoneNumber: new FormControl<string | null>(null, [Validators.required]),
        hospital: new FormControl<Hospital | null>(null, [Validators.required])
    });
    currentUser = toSignal(this.authService.activeUser);

    constructor(private apiService: ApiService,
                private authService: AuthenticationService,
                private notificationService: NotificationService,
                private cdr: ChangeDetectorRef,
                private route: ActivatedRoute,
                private router: Router) {
        const hospitalId = this.route.snapshot.params['id'];
        this.apiService.hospitalApi.getHospital(hospitalId as number).pipe(
            map(resp => resp.data),
            catchError(error => this.notificationService.showError(error.message))
        ).subscribe((hospital) => {
            if (hospital) {
                this.form.get('hospital')?.setValue(hospital);
                this.cdr.detectChanges();
            }
        })
    }

    goBack() {
        this.router.navigate([ROUTE_HOSPITAL, this.route.snapshot.params['id'], ROUTE_DEPARTMENTS])
    }

    onSubmit() {
        const name = this.form.get('name')?.value;
        const description = this.form.get('description')?.value;
        const phoneNumber = this.form.get('phoneNumber')?.value;
        const hospital = this.form.get('hospital')?.value;

        this.apiService.hospitalApi.createDepartment((hospital as Hospital).id
            , {
                name: name as string,
                description: description as string,
                phoneNumber: phoneNumber as string,
            }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully created department.');
                this.router.navigate([ROUTE_HOSPITAL, this.route.snapshot.params['id'], ROUTE_DEPARTMENTS])
            }
        });
    }
}
