import {
    addDays,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isValid,
    parse,
    parseISO,
    startOfMonth,
    startOfWeek,
} from 'date-fns';
import { enUS } from 'date-fns/locale';

const WEEK_OPTIONS = { weekStartsOn: 1 as const, locale: enUS };
export const DATE_DISPLAY_FORMAT = 'dd.MM.yyyy';
export const DATE_PLACEHOLDER = '__.__.____';
/** Widest 4-digit year the `dd.MM.yyyy` mask can represent. */
export const YEAR_MASK_MAX = 9999;

const MASK_DIGIT_SLOTS = [0, 1, 3, 4, 6, 7, 8, 9] as const;

export function getDateGrid(currentDate: Date): Date[] {
    const start = startOfWeek(startOfMonth(currentDate), WEEK_OPTIONS);
    const end = endOfWeek(endOfMonth(currentDate), WEEK_OPTIONS);

    return eachDayOfInterval({ start, end });
}

export function getDaysNames(): string[] {
    const start = startOfWeek(new Date(), WEEK_OPTIONS);

    return Array.from({ length: 7 }, (_, index) =>
        format(addDays(start, index), 'EEEEEE', { locale: enUS }),
    );
}

export function getMonthNames(): string[] {
    return Array.from({ length: 12 }, (_, month) =>
        format(new Date(2000, month, 1), 'LLLL', { locale: enUS }),
    );
}

export function getYearsArray(from: number, to: number): string[] {
    const years: string[] = [];

    for (let year = to; year >= from; year -= 1) {
        years.push(String(year));
    }

    return years;
}

export function parsePickerValue(value: string | Date): Date | null {
    if (value instanceof Date) {
        return isValid(value) ? value : null;
    }

    if (!value) {
        return null;
    }

    const isoDate = parseISO(value);
    if (isValid(isoDate)) {
        return isoDate;
    }

    const formatted = parse(value, DATE_DISPLAY_FORMAT, new Date());
    if (isValid(formatted)) {
        return formatted;
    }

    return null;
}

export function toIsoDateString(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

/**
 * Turns an IMask `dd.MM.yyyy` display value (`15.03.2024`, `1_.03.____`) into an ISO date.
 * Returns '' when no digits were entered, null for incomplete or impossible dates.
 */
export function normalizeTypedDate(raw: string, minYear?: number, maxYear?: number): string | null {
    const slots = MASK_DIGIT_SLOTS.map((pos) => {
        const char = raw[pos];
        return char && /\d/.test(char) ? char : '';
    });

    if (slots.every((slot) => !slot)) {
        return '';
    }

    if (slots.some((slot) => !slot)) {
        return null;
    }

    const displayValue = `${slots[0]}${slots[1]}.${slots[2]}${slots[3]}.${slots[4]}${slots[5]}${slots[6]}${slots[7]}`;
    const parsed = parse(displayValue, DATE_DISPLAY_FORMAT, new Date());

    if (!isValid(parsed) || format(parsed, DATE_DISPLAY_FORMAT) !== displayValue) {
        return null;
    }

    const year = parsed.getFullYear();
    if ((minYear !== undefined && year < minYear) || (maxYear !== undefined && year > maxYear)) {
        return null;
    }

    return toIsoDateString(parsed);
}

export function clampYear(date: Date, minYear?: number, maxYear?: number): Date {
    const year = date.getFullYear();

    if (minYear !== undefined && year < minYear) {
        return new Date(minYear, 0, 1);
    }

    if (maxYear !== undefined && year > maxYear) {
        return new Date(maxYear, 11, 1);
    }

    return date;
}
