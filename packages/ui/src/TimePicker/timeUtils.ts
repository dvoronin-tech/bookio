export const TIME_PLACEHOLDER = '--:--';

export type TimeValue = {
    hours: number;
    minutes: number;
};

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const MASK_DIGIT_SLOTS = [0, 1, 3, 4] as const;

export function parseTime(value: string): TimeValue | null {
    if (!TIME_REGEX.test(value)) {
        return null;
    }

    const [hours, minutes] = value.split(':');
    return { hours: Number(hours), minutes: Number(minutes) };
}

export function formatTime(hours: number, minutes: number): string {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** Converts value in "HH:mm" format to minutes */
export function toMinutes(value: string): number | null {
    const parsed = parseTime(value);
    return parsed ? parsed.hours * 60 + parsed.minutes : null;
}

interface ClampTimeOptions {
    min?: string;
    max?: string;
    step?: number;
}

export function clampTime(value: string, options: ClampTimeOptions): string {
    const { min, max, step } = options;

    const minTotal = min ? toMinutes(min) : null;
    const maxTotal = max ? toMinutes(max) : null;
    let total = toMinutes(value);

    if (total === null) {
        return value;
    }

    if (minTotal !== null && total < minTotal) {
        total = minTotal;
    }

    if (maxTotal !== null && total > maxTotal) {
        total = maxTotal;
    }

    if (step && total !== null && (total % step) !== 0) {
        total = Math.round(total / step) * step;
    }

    return formatTime(Math.floor(total / 60), total % 60);
}

/**
 * Turns an IMask `HH:mm` display value (`14:--`, `1-:3-`) into a complete time.
 * Empty slots become 0. Returns '' when no digits were entered.
 */
export function normalizeTypedTime(raw: string, min?: string, max?: string, step?: number): string | null {
    const slots = MASK_DIGIT_SLOTS.map((pos) => {
        const char = raw[pos];
        return char && /\d/.test(char) ? char : '';
    });

    if (slots.every((slot) => !slot)) {
        return '';
    }

    const hours = Math.min(Number(`${slots[0] || '0'}${slots[1] || '0'}`), 23);
    const minutes = Math.min(Number(`${slots[2] || '0'}${slots[3] || '0'}`), 59);

    return clampTime(formatTime(hours, minutes), { min, max, step });
}

export type TimeOption = {
    value: number;
    label: string;
    disabled: boolean;
};

export function buildHourOptions(min?: string, max?: string): TimeOption[] {
    const minTotal = min ? toMinutes(min) : null;
    const maxTotal = max ? toMinutes(max) : null;

    return Array.from({ length: 24 }, (_, hour) => {
        const hourStart = hour * 60;
        const hourEnd = hourStart + 59;
        const disabled =
            (minTotal !== null && hourEnd < minTotal) ||
            (maxTotal !== null && hourStart > maxTotal);

        return { value: hour, label: String(hour).padStart(2, '0'), disabled };
    });
}

export function buildMinuteOptions(
    step: number,
    min?: string,
    max?: string,
    selectedHour?: number | null,
): TimeOption[] {
    const minTotal = min ? toMinutes(min) : null;
    const maxTotal = max ? toMinutes(max) : null;
    const options: TimeOption[] = [];

    for (let minute = 0; minute < 60; minute += step) {
        let disabled = false;

        if (selectedHour) {
            const total = selectedHour * 60 + minute;
            disabled =
                (minTotal !== null && total < minTotal) || (maxTotal !== null && total > maxTotal);
        }

        options.push({ value: minute, label: String(minute).padStart(2, '0'), disabled });
    }

    return options;
}
