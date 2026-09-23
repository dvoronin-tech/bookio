import { type FC, useMemo, useState } from 'react';
import { Dialog } from '@bookio/ui';
import type { BookingByIdItem } from '#api/bookings/getBookingsById.ts';
import { BookingId } from '#components/BookingsTable/components/BookingId.tsx';
import { BookingStatus } from '#components/BookingsTable/components/BookingStatus.tsx';
import { formatBookingDate } from '#components/BookingsTable/utils/format.ts';
import { readBookingDataValue } from '#components/BookingsTable/utils/readBookingDataValue.ts';
import styles from './BookingDialog.module.scss';

interface BookingDialogProps {
    selectedBookingId: string | null;
    bookings: BookingByIdItem[];
    dataKeys: string[];
    onOpenChange: (open: boolean) => void;
}

const renderDataValue = (value: unknown) => {
    if (value == null || value === '') {
        return <i>EMPTY</i>;
    }

    if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
    }

    return String(value);
};

export const BookingDialog: FC<BookingDialogProps> = ({
    selectedBookingId,
    bookings,
    dataKeys,
    onOpenChange,
}) => {
    const booking = useMemo(
        () => bookings.find((booking) => booking.id === selectedBookingId),
        [bookings, selectedBookingId],
    );
    const [visibleBooking, setVisibleBooking] = useState(booking);

    if (booking && booking.id !== visibleBooking?.id) {
        setVisibleBooking(booking);
    }

    return (
        <Dialog
            open={!!booking}
            onOpenChange={onOpenChange}
            closeOnEscape
            contentClassName={styles.content}
        >
            <Dialog.Title>Booking</Dialog.Title>
            {visibleBooking && (
                <div className={styles.body}>
                    <header className={styles.header}>
                        <dl className={styles.fields}>
                            <div className={styles.field}>
                                <dt className={styles.label}>Booking Id</dt>
                                <dd className={styles.value}>
                                    <BookingId bookingId={visibleBooking.id} />
                                </dd>
                            </div>
                            <div className={styles.field}>
                                <dt className={styles.label}>Status</dt>
                                <dd className={styles.value}>
                                    <BookingStatus
                                        status={visibleBooking.status}
                                    />
                                </dd>
                            </div>
                            <div className={styles.field}>
                                <dt className={styles.label}>Created at</dt>
                                <dd className={styles.value}>
                                    {formatBookingDate(
                                        visibleBooking.createdAt,
                                    ) || <i>EMPTY</i>}
                                </dd>
                            </div>
                        </dl>
                    </header>
                    <section className={styles.dataSection}>
                        <h3 className={styles.sectionTitle}>Booking data</h3>
                        <div className={styles.dataContainer}>
                            {dataKeys.length === 0 ? (
                                <i>EMPTY</i>
                            ) : (
                                <dl className={styles.fields}>
                                    {dataKeys.map((key) => (
                                        <div key={key} className={styles.field}>
                                            <dt className={styles.label}>
                                                {key}
                                            </dt>
                                            <dd className={styles.value}>
                                                {renderDataValue(
                                                    readBookingDataValue(
                                                        visibleBooking.data,
                                                        key,
                                                    ),
                                                )}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            )}
                        </div>
                    </section>
                </div>
            )}
            <Dialog.Actions>
                <Dialog.Button
                    variant="simple-clean"
                    onClick={() => onOpenChange(false)}
                >
                    Close
                </Dialog.Button>
            </Dialog.Actions>
        </Dialog>
    );
};
