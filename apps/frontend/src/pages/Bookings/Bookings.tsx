import { type FC, useMemo } from 'react';
import styles from './Bookings.module.scss';
import { BookingsTable } from '#components/BookingsTable/BookingsTable.tsx';
import { useGetBookingsById } from '#api/bookings/getBookingsById.ts';
import { Button, PageLoader } from '@bookio/ui';
import { bookingsRouteApi } from '#lib/routeApis.ts';
import { BookingAsideBar } from '#components/AsideBar/BookingAsideBar.tsx';

export const Bookings: FC = () => {
    return (
        <div className={styles.bookingsPage}>
            <BookingAsideBar />
            <div className={styles.content}>
                <TableContent />
            </div>
        </div>
    );
};

const TableContent = () => {
    const { bookingFormId } = bookingsRouteApi.useParams();
    const {
        data: bookingsData,
        isPending,
        error,
        refetch,
    } = useGetBookingsById(bookingFormId);

    const data = useMemo(() => bookingsData ?? [], [bookingsData]);

    if (isPending) return <PageLoader />;
    if (error)
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

    if (!data.length)
        return (
            <div className={styles.emptyContainer}>
                <h2>No bookings yet</h2>
                <p>
                    When customers submit your booking forms, their appointments
                    will appear here.
                </p>
            </div>
        );
    return <BookingsTable data={data} />;
};
