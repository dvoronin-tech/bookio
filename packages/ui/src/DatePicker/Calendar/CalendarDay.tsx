import { clsx } from 'clsx';
import { format, isSameMonth } from 'date-fns';
import { memo } from 'react';
import styles from './Calendar.module.scss';

export type CalendarDayProps = {
    date: Date;
    isSelected: boolean;
    currentDate: Date;
    onClick: () => void;
};

export const CalendarDay = memo(function CalendarDay({
    date,
    isSelected,
    currentDate,
    onClick,
}: CalendarDayProps) {
    return (
        <button
            type="button"
            className={clsx(
                styles.cell,
                styles.dayButton,
                isSelected && styles.daySelected,
                !isSameMonth(date, currentDate) && styles.dayOutside,
            )}
            onClick={onClick}
        >
            <span className={styles.dayContent}>{format(date, 'd')}</span>
        </button>
    );
});
