import type { FC } from 'react';
import type { BookingByIdItem } from '#api/bookings/getBookingsById.ts';
import { BookingStatus } from '../components/BookingStatus.tsx';
import { SimpleCell } from '../components/SimpleCell.tsx';
import { formatBookingDate } from '../utils/format.ts';
import { readBookingDataValue } from '../utils/readBookingDataValue.ts';
import styles from './BookingCard.module.scss';

interface BookingCardProps {
    booking: BookingByIdItem;
    dataKeys: string[];
    onClick: () => void;
}

export const BookingCard: FC<BookingCardProps> = ({
    booking,
    dataKeys,
    onClick,
}) => (
    <button
        type="button"
        className={styles.card}
        onClick={onClick}
        aria-label={`Open booking ${booking.id}`}
    >
        <span className={styles.header}>
            <span className={styles.identity}>
                <span className={styles.label}>Booking Id</span>
                <span className={styles.id} title={booking.id}>
                    {booking.id.slice(0, 8)}…{booking.id.slice(-6)}
                </span>
            </span>
            <BookingStatus status={booking.status} />
        </span>
        <span className={styles.fields}>
            {dataKeys.map((key) => (
                <span key={key} className={styles.field}>
                    <span className={styles.label}>{key}</span>
                    <SimpleCell
                        data={readBookingDataValue(booking.data, key)}
                    />
                </span>
            ))}
        </span>
        <span className={styles.footer}>
            <span>Created {formatBookingDate(booking.createdAt)}</span>
            <span className={styles.openHint} aria-hidden="true">
                View booking ↗
            </span>
        </span>
    </button>
);
