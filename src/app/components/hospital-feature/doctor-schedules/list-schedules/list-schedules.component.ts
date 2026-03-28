import { Component, computed, effect, signal, untracked } from '@angular/core';
import { shared } from "../../../../app.config";
import { toSignal } from "@angular/core/rxjs-interop";
import { DayOfWeek, DoctorSchedule } from "../../../../rest/hospital/hospital.model";
import { AuthenticationService } from "../../../../common/service/authentication.service";
import { ApiService } from "../../../../common/service/api.service";
import { NotificationService } from "../../../../common/service/notification.service";
import { map } from "rxjs/operators";
import { catchError } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTE_CREATE_SCHEDULE } from "../create-schedule/create-schedule.component";
import { ROUTE_USERS } from "../../users/list-users/list-users.component";

export const ROUTE_SCHEDULES = 'doctor-schedules';

const DAYS_ORDER: DayOfWeek[] = [
    DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY
];

function getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    d.setHours(0, 0, 0, 0);
    return d;
}

@Component({
    selector: 'app-list-schedules',
    imports: [shared],
    templateUrl: './list-schedules.component.html',
    styleUrl: './list-schedules.component.scss',
})
export class ListSchedulesComponent {
    displayedColumns: string[] = ['Doctor', 'StartTime', 'EndTime', 'Duration', 'BreakStart', 'BreakEnd', 'Update'];
    daysOrder = DAYS_ORDER;
    currentUser = toSignal(this.authService.activeUser);
    schedules = signal<DoctorSchedule[] | null>(null);
    weekStart = signal<Date>(getMonday(new Date()));
    doctorId: number | null = null;

    isCurrentWeek = computed(() => {
        const thisMonday = getMonday(new Date());
        return this.weekStart().getTime() <= thisMonday.getTime();
    });

    weekEnd = computed(() => {
        const end = new Date(this.weekStart());
        end.setDate(end.getDate() + 6);
        return end;
    });

    weekLabel = computed(() => {
        const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        return `${fmt(this.weekStart())} – ${fmt(this.weekEnd())}`;
    });

    weekSchedules = computed(() => this.schedules() ?? []);

    constructor(private authService: AuthenticationService, private router: Router, private route: ActivatedRoute, private api: ApiService, private notificationService: NotificationService) {
        this.doctorId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;

        const weekParam = this.route.snapshot.queryParams['weekStart'];
        if (weekParam) {
            this.weekStart.set(new Date(weekParam));
        }

        effect(() => {
            const weekStart = this.weekStart();
            const weekEnd = untracked(() => this.weekEnd());
            const doctorId = this.doctorId ?? undefined;
            this.api.scheduleApi.listInRange(weekStart, weekEnd, doctorId).pipe(
                map(response => response.data),
                catchError(error => this.notificationService.showError(error.message))
            ).subscribe(response => {
                this.schedules.set(response);
            });
        });
    }

    schedulesForDay(day: DayOfWeek): DoctorSchedule[] {
        return this.weekSchedules().filter(s => s.dayOfWeek === day);
    }

    isDayInPast(day: DayOfWeek): boolean {
        const index = DAYS_ORDER.indexOf(day);
        const date = new Date(this.weekStart());
        date.setDate(date.getDate() + index);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }

    prevWeek(): void {
        const d = new Date(this.weekStart());
        d.setDate(d.getDate() - 7);
        this.weekStart.set(d);
    }

    nextWeek(): void {
        const d = new Date(this.weekStart());
        d.setDate(d.getDate() + 7);
        this.weekStart.set(d);
    }

    goBack() {
        this.router.navigate([ROUTE_USERS]);
    }

    addSchedule() {
        this.router.navigate([ROUTE_CREATE_SCHEDULE], {
            queryParams: {
                ...(this.doctorId ? { doctorId: this.doctorId } : {}),
                startDate: this.weekStart().toISOString(),
                endDate: this.weekEnd().toISOString(),
            }
        });
    }

}
