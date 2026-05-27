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
import { User, Role } from "../../../rest/user/user.model";

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
    doctors = signal<User[]>([]);
    favoriteDoctors = signal<User[]>([]);

    selectedHospital = signal<Hospital | null>(null);
    selectedDepartment = signal<Department | null>(null);
    selectedProcedure = signal<DepartmentProcedure | null>(null);
    selectedDoctor = signal<User | null>(null);
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
        this.apiService.userApi.getFavorites().pipe(
            map(r => (r.data ?? []).map(f => f.doctor)),
            catchError(() => of([]))
        ).subscribe(favs => this.favoriteDoctors.set(favs));

        this.apiService.hospitalApi.list().pipe(
            map(r => r.data ?? []),
            catchError(() => of([]))
        ).subscribe(hospitals => {
            this.hospitals.set(hospitals);
            this.isLoadingHospitals.set(false);
            if (hospitals.length > 0) {
                this.selectedHospital.set(hospitals[0]);
                this.loadDepartments(hospitals[0]);
            }
        });
    }

    private loadDepartments(hospital: Hospital) {
        this.isLoadingDepartments.set(true);
        this.apiService.hospitalApi.listDepartments('', hospital.id).pipe(
            map(r => r.data ?? []),
            catchError(() => of([]))
        ).subscribe(deps => {
            this.departments.set(deps);
            this.isLoadingDepartments.set(false);
            if (deps.length > 0) {
                this.selectedDepartment.set(deps[0]);
                this.loadProceduresAndDoctors(deps[0], hospital.id);
            }
        });
    }

    private loadProceduresAndDoctors(department: Department, hospitalId: number) {
        this.isLoadingProcedures.set(true);
        this.apiService.hospitalApi.listProcedures('', department.id).pipe(
            map(r => r.data ?? []),
            catchError(() => of([]))
        ).subscribe(procs => {
            this.procedures.set(procs);
            this.isLoadingProcedures.set(false);
            if (procs.length > 0) this.selectedProcedure.set(procs[0]);
        });

        this.apiService.userApi.list(hospitalId, '', Role.DOCTOR).pipe(
            map(r => {
                const all = (r.data ?? []).filter(u => u.department?.id === department.id);
                const favIds = new Set(this.favoriteDoctors().map(f => f.id));
                const sort = (a: User, b: User) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
                return [
                    ...all.filter(u => favIds.has(u.id)).sort(sort),
                    ...all.filter(u => !favIds.has(u.id)).sort(sort)
                ];
            }),
            catchError(() => of([]))
        ).subscribe(doctors => {
            this.doctors.set(doctors);
            this.selectedDoctor.set(doctors.find(d => this.isFavorite(d)) ?? null);
        });
    }

    selectHospital(hospital: Hospital, stepper: MatStepper) {
        if (this.selectedHospital()?.id !== hospital.id) {
            this.selectedDepartment.set(null);
            this.selectedProcedure.set(null);
            this.selectedDate = null;
            this.slots.set([]);
            this.selectedSlot = null;
            this.loadDepartments(hospital);
        }
        this.selectedHospital.set(hospital);
        stepper.next();
    }

    selectDepartment(department: Department, stepper: MatStepper) {
        if (this.selectedDepartment()?.id !== department.id) {
            this.selectedProcedure.set(null);
            this.selectedDoctor.set(null);
            this.selectedDate = null;
            this.slots.set([]);
            this.selectedSlot = null;
            const hospitalId = this.selectedHospital()?.id;
            if (hospitalId) this.loadProceduresAndDoctors(department, hospitalId);
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

    isFavorite(doctor: User): boolean {
        return this.favoriteDoctors().some(f => f.id === doctor.id);
    }

    selectDoctor(doctor: User | null) {
        this.selectedDoctor.set(doctor);
        if (this.selectedDate) {
            this.selectDate(this.selectedDate);
        }
    }

    selectDate(date: any) {
        this.selectedDate = date;
        this.selectedSlot = null;

        const jsDate: Date = date instanceof Date ? date : date.toJSDate();
        const y = jsDate.getFullYear();
        const mo = jsDate.getMonth();
        const d = jsDate.getDate();
        const from = new Date(Date.UTC(y, mo, d, 0, 0, 0, 0));
        const to = new Date(Date.UTC(y, mo, d, 23, 59, 59, 999));

        const doctor = this.selectedDoctor();
        const departmentId = this.selectedDepartment()?.id;

        const request$ = doctor
            ? this.apiService.appointmentApi.listOpenByDoctor(doctor.id, from.getTime(), to.getTime())
            : this.apiService.appointmentApi.listOpenByDepartment(departmentId!, from.getTime(), to.getTime());

        if (!doctor && !departmentId) return;

        this.isLoadingSlots.set(true);
        request$.pipe(
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
