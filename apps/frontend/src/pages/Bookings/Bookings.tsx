import { type FC, useMemo } from 'react';
import styles from './Bookings.module.scss';
import { BookingsTable } from '#components/BookingsTable/BookingsTable.tsx';
import { useGetBookingsById } from '#api/bookings/getBookingsById.ts';
import { Button, PageLoader } from '@bookio/ui';
import { getRouteApi } from '@tanstack/react-router';

export const Bookings: FC = () => {
    const { bookingFormId } = getRouteApi(
        '/_authenticated/$organizationId/bookings/$bookingFormId',
    ).useParams();
    const {
        data: bookingsData,
        isPending,
        error,
        refetch,
    } = useGetBookingsById(bookingFormId);

    const data = useMemo(() => bookingsData ?? [], [bookingsData]);

    if (isPending) {
        return <PageLoader />;
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <h2>Failed to load bookings</h2>
                <p>{error.message}</p>
                <Button
                    variant="primary-outlined"
                    onClick={() => void refetch()}
                >
                    Retry
                </Button>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={styles.bookingsPage}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h1>Bookings</h1>
                        <span className={styles.badge}>0</span>
                    </div>
                </div>
                <div className={styles.emptyContainer}>
                    <h2>No bookings yet</h2>
                    <p>
                        When customers submit your booking forms, their
                        appointments will appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.bookingsPage}>
            <BookingsTable data={data} />
        </div>
    );
};
