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
export const DATE_PLACEHOLDER = 'dd.MM.yyyy';
export const MIN_YEAR = 1900;
export const MAX_YEAR_OFFSET = 10;

export function getMaxYear(now = new Date()) {
    return now.getFullYear() + MAX_YEAR_OFFSET;
}

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

export function clampYear(date: Date, minYear: number, maxYear: number): Date {
    const year = date.getFullYear();

    if (year < minYear) {
        return new Date(minYear, 0, 1);
    }

    if (year > maxYear) {
        return new Date(maxYear, 11, 1);
    }

    return date;
}
