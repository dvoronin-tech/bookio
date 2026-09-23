import { type FC, useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button, PageLoader } from '@bookio/ui';
import { useGetBookingForms } from '#api/bookingForms/getBookingForms.ts';
import { organizationRouteApi } from '#lib/routeApis.ts';
import { BookingFormTile } from './BookingFormTile.tsx';
import styles from './BookingsIndex.module.scss';

export const BookingsIndex: FC = () => {
    const navigate = useNavigate();
    const { organizationId } = organizationRouteApi.useParams();
    const {
        data: bookingForms,
        isPending,
        error,
        refetch,
    } = useGetBookingForms(organizationId);

    const handleRetry = useCallback(() => {
        void refetch();
    }, [refetch]);

    const totalBookings = useMemo(
        () =>
            bookingForms?.reduce(
                (sum, bookingForm) => sum + bookingForm.totalBookings,
                0,
            ) ?? 0,
        [bookingForms],
    );

    if (isPending) {
        return <PageLoader />;
    }

    if (error) {
        return (
            <div className={styles.state}>
                <h2>Failed to load booking forms</h2>
                <p>{error.message}</p>
                <Button variant="primary-outlined" onClick={handleRetry}>
                    Retry
                </Button>
            </div>
        );
    }

    if (bookingForms.length === 0) {
        return (
            <div className={styles.state}>
                <h2>No booking forms yet</h2>
                <p>Create a booking form to start collecting bookings.</p>
                <Button
                    variant="primary-filled"
                    className={styles.stateButton}
                    onClick={() =>
                        void navigate({
                            to: '/$organizationId/booking-forms/create',
                            params: { organizationId },
                        })
                    }
                >
                    Create your first booking form
                </Button>
            </div>
        );
    }

    const bookingsLabel = totalBookings === 1 ? 'booking' : 'bookings';
    const formsLabel = bookingForms.length === 1 ? 'form' : 'forms';

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={styles.pageTitle}>Bookings</h2>
                <div className={styles.metaChips}>
                    <Button
                        variant="simple-filled"
                        className={styles.chipButton}
                    >
                        {bookingForms.length} {formsLabel}
                    </Button>
                    <Button
                        variant="simple-filled"
                        className={styles.chipButton}
                    >
                        {totalBookings} {bookingsLabel}
                    </Button>
                </div>
            </div>

            <div className={styles.grid}>
                {bookingForms.map((bookingForm) => (
                    <BookingFormTile
                        key={bookingForm.id}
                        organizationId={organizationId}
                        bookingForm={bookingForm}
                    />
                ))}
            </div>
        </div>
    );
};
