import { clsx } from 'clsx';
import { addMonths, addYears, isSameDay, parseISO, subMonths, subYears } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    clampYear,
    getDateGrid,
    getDaysNames,
    getMonthNames,
    getYearsArray,
    parsePickerValue,
    toIsoDateString,
} from '../dateUtils.js';
import type { SelectDropdownOption } from '../../SelectDropdown/SelectDropdown.js';
import { CalendarDay } from './CalendarDay.js';
import { CalendarHeaderSection } from './CalendarHeaderSection.js';
import styles from './Calendar.module.scss';

export type CalendarProps = {
    value: string | Date;
    onChange: (isoDate: string) => void;
    minYear?: number;
    maxYear?: number;
};

export function Calendar({ value, onChange, minYear, maxYear }: CalendarProps) {
    const selectedDate = useMemo(() => parsePickerValue(value), [value]);
    const selectedIso = selectedDate ? toIsoDateString(selectedDate) : null;
    const [currentDate, setCurrentDate] = useState(() =>
        clampYear(selectedDate ?? new Date(), minYear, maxYear),
    );

    useEffect(() => {
        if (!selectedIso) {
            setCurrentDate((prev) => clampYear(prev, minYear, maxYear));
            return;
        }

        const date = parseISO(selectedIso);
        setCurrentDate((prev) => {
            if (
                prev.getFullYear() === date.getFullYear() &&
                prev.getMonth() === date.getMonth() &&
                (minYear === undefined || date.getFullYear() >= minYear) &&
                (maxYear === undefined || date.getFullYear() <= maxYear)
            ) {
                return prev;
            }

            return clampYear(new Date(date.getFullYear(), date.getMonth(), 1), minYear, maxYear);
        });
    }, [selectedIso, minYear, maxYear]);

    const calendarDays = useMemo(() => getDateGrid(currentDate), [currentDate]);
    const daysOfWeek = useMemo(() => getDaysNames(), []);
    const monthOptions = useMemo(() => getMonthNames(), []);
    const yearOptions = useMemo(() => {
        const viewYear = currentDate.getFullYear();
        const from = minYear ?? 0;
        const to = maxYear ?? Math.max(viewYear, from);

        return getYearsArray(from, to).reverse();
    }, [currentDate, minYear, maxYear]);

    const setViewDate = useCallback(
        (next: Date) => {
            setCurrentDate(clampYear(next, minYear, maxYear));
        },
        [minYear, maxYear],
    );

    const handlePreviousMonth = useCallback(() => {
        setViewDate(subMonths(currentDate, 1));
    }, [currentDate, setViewDate]);

    const handleNextMonth = useCallback(() => {
        setViewDate(addMonths(currentDate, 1));
    }, [currentDate, setViewDate]);

    const handleChangeMonth = useCallback(
        (month: SelectDropdownOption) => {
            const monthIndex = monthOptions.indexOf(String(month));
            if (monthIndex === -1) return;
            setViewDate(new Date(currentDate.getFullYear(), monthIndex, 1));
        },
        [currentDate, setViewDate, monthOptions],
    );

    const handlePreviousYear = useCallback(() => {
        setViewDate(subYears(currentDate, 1));
    }, [currentDate, setViewDate]);

    const handleNextYear = useCallback(() => {
        setViewDate(addYears(currentDate, 1));
    }, [currentDate, setViewDate]);

    const handleChangeYear = useCallback(
        (year: SelectDropdownOption) => {
            setViewDate(new Date(Number(year), currentDate.getMonth(), 1));
        },
        [currentDate, setViewDate],
    );

    const handleChangeDate = useCallback(
        (date: Date) => {
            const year = date.getFullYear();
            if (minYear !== undefined && year < minYear) {
                return;
            }
            if (maxYear !== undefined && year > maxYear) {
                return;
            }

            onChange(toIsoDateString(date));
        },
        [onChange, minYear, maxYear],
    );

    return (
        <div className={styles.calendar}>
            <div className={styles.header}>
                <CalendarHeaderSection
                    onPrev={handlePreviousMonth}
                    onNext={handleNextMonth}
                    selected={monthOptions[currentDate.getMonth()]}
                    options={monthOptions}
                    onChange={handleChangeMonth}
                    prevLabel="Previous month"
                    nextLabel="Next month"
                />
                <CalendarHeaderSection
                    onPrev={handlePreviousYear}
                    onNext={handleNextYear}
                    selected={String(currentDate.getFullYear())}
                    options={yearOptions}
                    onChange={handleChangeYear}
                    prevLabel="Previous year"
                    nextLabel="Next year"
                />
            </div>

            <div className={styles.grid}>
                {daysOfWeek.map((day) => (
                    <span key={day} className={clsx(styles.cell, styles.dayName)}>
                        {day}
                    </span>
                ))}

                {calendarDays.map((date) => (
                    <CalendarDay
                        key={date.toISOString()}
                        date={date}
                        isSelected={selectedDate != null && isSameDay(date, selectedDate)}
                        currentDate={currentDate}
                        onClick={() => handleChangeDate(date)}
                    />
                ))}
            </div>
        </div>
    );
}
