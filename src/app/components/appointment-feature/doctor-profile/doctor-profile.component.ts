import { Component, signal } from '@angular/core';
import { Location } from '@angular/common';
import { DateTime } from 'luxon';
import { ActivatedRoute, Router } from '@angular/router';
import { shared } from '../../../app.config';
import { ApiService } from '../../../common/service/api.service';
import { NotificationService } from '../../../common/service/notification.service';
import { User } from '../../../rest/user/user.model';
import { TimeSlotDTO } from '../../../rest/hospital/hospital.model';
import { map } from 'rxjs/operators';
import { catchError, of } from 'rxjs';
import { ROUTE_APPOINTMENTS } from '../appointments/list-appointments/list-appointments.component';

export const ROUTE_DOCTOR_PROFILE = 'doctor-profile';

@Component({
    selector: 'app-doctor-profile',
    imports: [shared],
    templateUrl: './doctor-profile.component.html',
    styleUrl: './doctor-profile.component.scss',
})
export class DoctorProfileComponent {
    doctor = signal<User | null>(null);
    slots = signal<TimeSlotDTO[]>([]);
    selectedDate: DateTime | null = null;
    selectedSlot: TimeSlotDTO | null = null;
    isLoadingDoctor = signal(false);
    isLoadingSlots = signal(false);
    isBooking = signal(false);
    favorites = signal<number[]>([]);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private api: ApiService,
        private notificationService: NotificationService,
        private location: Location
    ) {
        const doctorId = Number(this.route.snapshot.params['id']);
        this.isLoadingDoctor.set(true);
        this.api.userApi.getUser(doctorId).pipe(
            map(r => r.data),
            catchError(err => this.notificationService.showError(err.message))
        ).subscribe(doctor => {
            if (doctor) this.doctor.set(doctor as User);
            this.isLoadingDoctor.set(false);
        });

        this.api.userApi.getFavorites().pipe(
            map(r => (r.data ?? []).map(f => f.doctor.id)),
            catchError(() => of([]))
        ).subscribe(ids => this.favorites.set(ids));
    }

    selectDate(date: DateTime): void {
        this.selectedDate = date;
        this.selectedSlot = null;

        const doctor = this.doctor();
        if (!doctor) return;

        const dateStr = date.toISODate();
        if (!dateStr) return;

        this.isLoadingSlots.set(true);
        this.api.appointmentApi.listAvailableByDoctor(doctor.id, dateStr).pipe(
            map(r => r.data ?? []),
            catchError(err => this.notificationService.showError(err.message))
        ).subscribe(slots => {
            if (slots) this.slots.set(slots as TimeSlotDTO[]);
            this.isLoadingSlots.set(false);
        });
    }

    selectSlot(slot: TimeSlotDTO): void {
        this.selectedSlot = slot;
    }

    slotDuration(slot: TimeSlotDTO): number {
        const [sh, sm] = slot.startTime.split(':').map(Number);
        const [eh, em] = slot.endTime.split(':').map(Number);
        return (eh * 60 + em) - (sh * 60 + sm);
    }

    confirmBooking(): void {
        const slot = this.selectedSlot;
        const doctor = this.doctor();
        if (!slot || !doctor || !this.selectedDate) return;
        this.isBooking.set(true);
        this.api.appointmentApi.bookAppointment({
            doctorId: doctor.id,
            date: this.selectedDate.toISODate()!,
            startTime: slot.startTime
        }).pipe(
            map(r => r.data),
            catchError(err => this.notificationService.showError(err.message))
        ).subscribe(response => {
            if (response) {
                this.notificationService.showSuccess('Successfully booked your appointment.');
                this.router.navigate([ROUTE_APPOINTMENTS]);
            }
            this.isBooking.set(false);
        });
    }

    isFavorite(): boolean {
        const doc = this.doctor();
        return doc ? this.favorites().includes(doc.id) : false;
    }

    toggleFavorite(): void {
        const doc = this.doctor();
        if (!doc) return;
        if (this.isFavorite()) {
            this.api.userApi.removeFavorite(doc.id).pipe(
                catchError(err => this.notificationService.showError(err.message))
            ).subscribe(() => {
                this.favorites.update(ids => ids.filter(id => id !== doc.id));
            });
        } else {
            this.api.userApi.addFavorite(doc.id).pipe(
                catchError(err => this.notificationService.showError(err.message))
            ).subscribe(() => {
                this.favorites.update(ids => [...ids, doc.id]);
            });
        }
    }

    goBack(): void {
        this.location.back();
    }

    minDate = DateTime.now();

    locationLabel(city: string, country: string): string {
        return [city, country].filter(v => !!v).join(', ');
    }
}
