import { AbstractControl, ValidatorFn } from "@angular/forms";

function parseTime(value: string | null): number | null {
    if (!value) return null;
    const [h, m] = value.split(':').map(Number);
    return h * 60 + m;
}

function setOrClearError(control: AbstractControl | null, key: string, hasError: boolean): void {
    if (!control) return;
    const current = { ...control.errors };
    if (hasError) {
        control.setErrors({ ...current, [key]: true });
    } else if (current[key]) {
        delete current[key];
        control.setErrors(Object.keys(current).length ? current : null);
    }
}

export const scheduleTimeValidator: ValidatorFn = (group: AbstractControl): null => {
    const startTime = parseTime(group.get('startTime')?.value);
    const endTime = parseTime(group.get('endTime')?.value);
    const breakStart = parseTime(group.get('breakStartTime')?.value);
    const breakEnd = parseTime(group.get('breakEndTime')?.value);

    setOrClearError(
        group.get('endTime'),
        'startAfterEnd',
        startTime !== null && endTime !== null && startTime >= endTime
    );

    setOrClearError(
        group.get('breakEndTime'),
        'breakStartAfterBreakEnd',
        breakStart !== null && breakEnd !== null && breakStart >= breakEnd
    );

    setOrClearError(
        group.get('breakStartTime'),
        'breakOutsideSchedule',
        breakStart !== null && startTime !== null && endTime !== null && (breakStart < startTime || breakStart >= endTime)
    );

    setOrClearError(
        group.get('breakEndTime'),
        'breakOutsideSchedule',
        breakEnd !== null && startTime !== null && endTime !== null && (breakEnd <= startTime || breakEnd > endTime)
    );

    return null;
};
