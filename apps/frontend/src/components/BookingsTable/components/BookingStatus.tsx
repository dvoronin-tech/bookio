import { type FC } from 'react';
import clsx from 'clsx';
import styles from './Components.module.scss';
import { formatStatusText } from '#components/BookingsTable/utils/format.ts';

interface BookingStatusProps {
    status: string;
}

const getStatusClass = (status: string) => {
    switch (status) {
        case 'confirmed':
            return styles.confirmed;
        case 'cancelled_by_user':
        case 'cancelled_by_admin':
            return styles.cancelled;
        case 'pending':
        default:
            return styles.pending;
    }
};

export const BookingStatus: FC<BookingStatusProps> = ({ status }) => {
    return (
        <span className={clsx(styles.statusBadge, getStatusClass(status))}>
            <span className={styles.statusDot} />
            {formatStatusText(status)}
        </span>
    );
};
