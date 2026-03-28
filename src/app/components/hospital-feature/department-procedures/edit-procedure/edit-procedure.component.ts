import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { shared } from "../../../../app.config";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Department } from "../../../../rest/hospital/hospital.model";
import { ApiService } from "../../../../common/service/api.service";
import { catchError, of } from "rxjs";
import { map } from "rxjs/operators";
import { NotificationService } from "../../../../common/service/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_PROCEDURES } from "../list-procedures/list-procedures.component";

export const ROUTE_EDIT_PROCEDURE = 'edit-procedure';

@Component({
    selector: 'app-edit-procedure',
    imports: [shared],
    templateUrl: './edit-procedure.component.html',
    styleUrl: './edit-procedure.component.scss',
})
export class EditProcedureComponent {
    form = new FormGroup({
        name: new FormControl<string | null>('', [Validators.required]),
        description: new FormControl<string | null>(null),
        price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        department: new FormControl<Department | null>(null, [Validators.required])
    });
    departments$ = this.apiService.hospitalApi.listDepartments().pipe(
        map(response => response.data),
        catchError(() => of([]))
    );
    private departmentId: number | null = null;

    compareDepartmentById = (a: Department | null, b: Department | null): boolean => {
        if (!a || !b) return a === b;
        return a.id === b.id;
    };

    constructor(private apiService: ApiService, private route: ActivatedRoute, private notificationService: NotificationService, private router: Router, private location: Location) {
        this.form.get('department')?.disable();
        const id = this.route.snapshot.params['id'];
        this.apiService.hospitalApi.getProcedure(id).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((procedure) => {
            this.departmentId = procedure?.department?.id ?? null;
            this.form.patchValue({
                name: procedure?.name,
                description: procedure?.description,
                price: procedure?.price,
                department: procedure?.department
            });
        });
    }

    onSubmit() {
        const name = this.form.get('name')?.value;
        const description = this.form.get('description')?.value;
        const price = this.form.get('price')?.value;

        this.apiService.hospitalApi.updateProcedure(this.route.snapshot.params['id'], {
            name: name as string,
            description: description as string,
            price: price as number,
        }).pipe(
            map(response => response.data),
            catchError(error => this.notificationService.showError(error))
        ).subscribe((response) => {
            if (response) {
                this.notificationService.showSuccess('Successfully edited procedure.');
                this.router.navigate([`/department/${this.departmentId}/${ROUTE_PROCEDURES}`]);
            }
        });
    }

    goBack() { this.location.back(); }
}
