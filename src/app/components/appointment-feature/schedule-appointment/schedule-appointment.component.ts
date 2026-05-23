import { Component, signal } from '@angular/core';
import { shared } from "../../../app.config";
import { Department, DepartmentProcedure, Hospital, OpenSlotDTO } from "../../../rest/hospital/hospital.model";
import { MatStep, MatStepLabel, MatStepper, MatStepperPrevious } from "@angular/material/stepper";
import { ApiService } from "../../../common/service/api.service";
import { map } from "rxjs/operators";
import { catchError, of } from "rxjs";
import { NotificationService } from "../../../common/service/notification.service";
import { ROUTE_APPOINTMENTS } from "../appointments/list-appointments/list-appointments.component";
import { Router } from "@angular/router";

export const ROUTE_SCHEDULE_APPOINTMENT = 'schedule-appointment';

@Component({
    selector: 'app-schedule-appointment',
    imports: [shared, MatStepper, MatStep, MatStepLabel, MatStepperPrevious],
    templateUrl: './schedule-appointment.component.html',
    styleUrl: './schedule-appointment.component.scss',
})
export class ScheduleAppointmentComponent {

    hospitals = signal<Hospital[]>([]);
    departments = signal<Department[]>([]);
    procedures = signal<DepartmentProcedure[]>([]);
    slots = signal<OpenSlotDTO[]>([]);

    selectedHospital = signal<Hospital | null>(null);
    selectedDepartment = signal<Department | null>(null);
    selectedProcedure = signal<DepartmentProcedure | null>(null);
    selectedDate: Date | null = null;
    selectedSlot: OpenSlotDTO | null = null;

    isLoadingHospitals = signal(true);
    isLoadingDepartments = signal(false);
    isLoadingProcedures = signal(false);
    isLoadingSlots = signal(false);

    minDate = new Date();

    constructor(
        private apiService: ApiService,
        private notificationService: NotificationService,
        private router: Router
    ) {
        this.apiService.hospitalApi.list().pipe(
            map(r => r.data ?? []),
            catchError(() => of([]))
        ).subscribe(hospitals => {
            this.hospitals.set(hospitals);
            this.isLoadingHospitals.set(false);
        });
    }

    selectHospital(hospital: Hospital, stepper: MatStepper) {
        if (this.selectedHospital()?.id !== hospital.id) {
            this.selectedDepartment.set(null);
            this.selectedProcedure.set(null);
            this.selectedDate = null;
            this.slots.set([]);
            this.selectedSlot = null;

            this.isLoadingDepartments.set(true);
            this.apiService.hospitalApi.listDepartments('', hospital.id).pipe(
                map(r => r.data ?? []),
                catchError(() => of([]))
            ).subscribe(deps => {
                this.departments.set(deps);
                this.isLoadingDepartments.set(false);
            });
        }
        this.selectedHospital.set(hospital);
        stepper.next();
    }

    selectDepartment(department: Department, stepper: MatStepper) {
        if (this.selectedDepartment()?.id !== department.id) {
            this.selectedProcedure.set(null);
            this.selectedDate = null;
            this.slots.set([]);
            this.selectedSlot = null;

            this.isLoadingProcedures.set(true);
            this.apiService.hospitalApi.listProcedures('', department.id).pipe(
                map(r => r.data ?? []),
                catchError(() => of([]))
            ).subscribe(procs => {
                this.procedures.set(procs);
                this.isLoadingProcedures.set(false);
            });
        }
        this.selectedDepartment.set(department);
        stepper.next();
    }

    selectProcedure(procedure: DepartmentProcedure, stepper: MatStepper) {
        if (this.selectedProcedure()?.id !== procedure.id) {
            this.selectedDate = null;
            this.slots.set([]);
            this.selectedSlot = null;
        }
        this.selectedProcedure.set(procedure);
        stepper.next();
    }

    selectDate(date: Date) {
        this.selectedDate = date;
        this.selectedSlot = null;

        const from = new Date(date);
        from.setHours(0, 0, 0, 0);
        const to = new Date(date);
        to.setHours(23, 59, 59, 999);

        const departmentId = this.selectedDepartment()?.id;
        if (!departmentId) return;

        this.isLoadingSlots.set(true);
        this.apiService.appointmentApi.listOpenByDepartment(departmentId, from.getTime(), to.getTime()).pipe(
            map(r => r.data ?? []),
            catchError(() => of([]))
        ).subscribe(slots => {
            this.slots.set(slots);
            this.isLoadingSlots.set(false);
        });
    }

    selectSlot(slot: OpenSlotDTO, stepper: MatStepper) {
        this.selectedSlot = slot;
        stepper.next();
    }

    confirm() {
        const slot = this.selectedSlot;
        const procedure = this.selectedProcedure();
        if (!slot || !procedure) return;

        this.apiService.appointmentApi.bookAppointment({
            doctorId: slot.doctorId,
            date: slot.date,
            startTime: slot.startTime,
            departmentProcedureId: procedure.id
        }).pipe(
            map(r => r.data),
            catchError(() => of(null))
        ).subscribe(response => {
            if (response) {
                this.notificationService.showSuccess('Appointment scheduled! A confirmation will be sent to your email.');
                this.router.navigate([ROUTE_APPOINTMENTS]);
            }
        });
    }

    goBack() {
        this.router.navigate([ROUTE_APPOINTMENTS]);
    }
}
