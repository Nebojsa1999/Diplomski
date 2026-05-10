import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { shared } from '../../../app.config';
import { ApiService } from '../../../common/service/api.service';
import { AuthenticationService } from '../../../common/service/authentication.service';
import { NotificationService } from '../../../common/service/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Role, User } from '../../../rest/user/user.model';
import { Department } from '../../../rest/hospital/hospital.model';
import { FormControl, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { catchError, of } from 'rxjs';

export const ROUTE_DOCTOR_LIST = 'doctors';

@Component({
    selector: 'app-doctor-list',
    imports: [shared],
    templateUrl: './doctor-list.component.html',
    styleUrl: './doctor-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorListComponent {
    currentUser = toSignal(this.authService.activeUser);
    allDoctors = signal<User[]>([]);
    departments = signal<Department[]>([]);
    favorites = signal<number[]>([]);
    isLoading = signal(false);

    filterForm = new FormGroup({
        name: new FormControl<string>(''),
        department: new FormControl<string>(''),
    });

    filterName = signal('');
    filterDepartment = signal('');

    filteredDoctors = computed(() => {
        const doctors = this.allDoctors();
        const favIds = this.favorites();
        const name = this.filterName().toLowerCase();
        const dept = this.filterDepartment();

        const result = doctors.filter(d => {
            const matchesName =
                !name ||
                d.firstName.toLowerCase().includes(name) ||
                d.lastName.toLowerCase().includes(name);
            const matchesDept = !dept || d.department?.name === dept;
            return matchesName && matchesDept;
        });

        return result.sort((a, b) => {
            const aFav = favIds.includes(a.id) ? 0 : 1;
            const bFav = favIds.includes(b.id) ? 0 : 1;
            return aFav - bFav;
        });
    });

    constructor(
        private api: ApiService,
        public authService: AuthenticationService,
        private notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.api.userApi.getFavorites().pipe(
            map(r => (r.data ?? []).map(f => f.doctor.id)),
            catchError(() => of([]))
        ).subscribe(ids => this.favorites.set(ids));

        effect(() => {
            const user = this.currentUser();
            if (user) {
                const queryHospitalId = this.route.snapshot.queryParams['hospitalId'];
                const hospitalId = queryHospitalId ? +queryHospitalId : user.hospital?.id;
                if (!hospitalId) return;
                this.isLoading.set(true);

                this.api.hospitalApi.listDepartments(undefined, hospitalId).pipe(
                    map(r => r.data ?? []),
                    catchError(() => of([]))
                ).subscribe(deps => this.departments.set(deps));

                this.api.userApi
                    .list(hospitalId, undefined, Role.DOCTOR)
                    .pipe(
                        map(r => r.data ?? []),
                        catchError(err => this.notificationService.showError(err.message))
                    )
                    .subscribe(doctors => {
                        if (doctors) this.allDoctors.set(doctors as User[]);
                        this.isLoading.set(false);
                    });
            }
        });
    }

    isFavorite(doctorId: number): boolean {
        return this.favorites().includes(doctorId);
    }

    toggleFavorite(event: MouseEvent, doctorId: number): void {
        event.stopPropagation();
        if (this.isFavorite(doctorId)) {
            this.api.userApi.removeFavorite(doctorId).pipe(
                catchError(err => this.notificationService.showError(err.message))
            ).subscribe(() => {
                this.favorites.update(ids => ids.filter(id => id !== doctorId));
            });
        } else {
            this.api.userApi.addFavorite(doctorId).pipe(
                catchError(err => this.notificationService.showError(err.message))
            ).subscribe(() => {
                this.favorites.update(ids => [...ids, doctorId]);
            });
        }
    }

    viewProfile(doctorId: number): void {
        this.router.navigate([`/doctor-profile/${doctorId}`]);
    }

    applyFilter(): void {
        this.filterName.set(this.filterForm.get('name')?.value ?? '');
        this.filterDepartment.set(this.filterForm.get('department')?.value ?? '');
    }

    resetFilter(): void {
        this.filterForm.reset({ name: '', department: '' });
        this.filterName.set('');
        this.filterDepartment.set('');
    }
}
