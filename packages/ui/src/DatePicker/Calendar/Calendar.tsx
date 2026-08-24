import { clsx } from 'clsx';
import { addMonths, addYears, isSameDay, subMonths, subYears } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import {
    clampYear,
    getDateGrid,
    getDaysNames,
    getMaxYear,
    getMonthNames,
    getYearsArray,
    MIN_YEAR,
    parsePickerValue,
    toIsoDateString,
} from '../dateUtils.js';
import { CalendarDay } from './CalendarDay.js';
import { CalendarHeaderSection } from './CalendarHeaderSection.js';
import styles from './Calendar.module.scss';

export type CalendarProps = {
    value: string | Date;
    onChange: (isoDate: string) => void;
};

export function Calendar({ value, onChange }: CalendarProps) {
    const selectedDate = useMemo(() => parsePickerValue(value), [value]);
    const maxYear = useMemo(() => new Date().getFullYear(), []);
    const [currentDate, setCurrentDate] = useState(() => selectedDate ?? new Date());

    const calendarDays = useMemo(() => getDateGrid(currentDate), [currentDate]);
    const daysOfWeek = useMemo(() => getDaysNames(), []);
    const monthOptions = useMemo(
        () =>
            getMonthNames().map((label, index) => ({
                value: String(index),
                label,
            })),
        [],
    );
    const yearOptions = useMemo(
        () => getYearsArray(MIN_YEAR, maxYear).map((year) => ({ value: year, label: year })),
        [maxYear],
    );

    const setViewDate = useCallback(
        (next: Date) => {
            setCurrentDate(clampYear(next, MIN_YEAR, maxYear));
        },
        [maxYear],
    );

    const handlePreviousMonth = useCallback(() => {
        setViewDate(subMonths(currentDate, 1));
    }, [currentDate, setViewDate]);

    const handleNextMonth = useCallback(() => {
        setViewDate(addMonths(currentDate, 1));
    }, [currentDate, setViewDate]);

    const handleChangeMonth = useCallback(
        (month: string) => {
            setViewDate(new Date(currentDate.getFullYear(), Number(month), 1));
        },
        [currentDate, setViewDate],
    );

    const handlePreviousYear = useCallback(() => {
        setViewDate(subYears(currentDate, 1));
    }, [currentDate, setViewDate]);

    const handleNextYear = useCallback(() => {
        setViewDate(addYears(currentDate, 1));
    }, [currentDate, setViewDate]);

    const handleChangeYear = useCallback(
        (year: string) => {
            setViewDate(new Date(Number(year), currentDate.getMonth(), 1));
        },
        [currentDate, setViewDate],
    );

    const handleChangeDate = useCallback(
        (date: Date) => {
            onChange(toIsoDateString(date));
        },
        [onChange],
    );

    return (
        <div className={styles.calendar}>
            <div className={styles.header}>
                <CalendarHeaderSection
                    onPrev={handlePreviousMonth}
                    onNext={handleNextMonth}
                    selected={String(currentDate.getMonth())}
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
