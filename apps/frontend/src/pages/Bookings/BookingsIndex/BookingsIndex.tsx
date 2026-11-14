import { type FC, useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button, PageLoader } from '@bookio/ui';
import { useGetBookingForms } from '#api/bookingForms/getBookingForms.ts';
import { organizationRouteApi } from '#lib/routeApis.ts';
import { BookingFormTile } from './BookingFormTile.tsx';
import styles from './BookingsIndex.module.scss';
import { plural } from '#i18n/locale';
import { m } from '../../../paraglide/messages.js';

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
                <h2>{m.bookings_forms_failed()}</h2>
                <p>{error.message}</p>
                <Button variant="primary-outlined" onClick={handleRetry}>
                    {m.retry()}
                </Button>
            </div>
        );
    }

    if (bookingForms.length === 0) {
        return (
            <div className={styles.state}>
                <h2>{m.forms_empty()}</h2>
                <p>{m.bookings_no_forms_description()}</p>
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
                    {m.bookings_create_first()}
                </Button>
            </div>
        );
    }

    const formsLabel = plural(bookingForms.length, {
        one: m.forms_count_one({ count: bookingForms.length }),
        few: m.forms_count_few({ count: bookingForms.length }),
        many: m.forms_count_many({ count: bookingForms.length }),
    });
    const bookingsLabel = plural(totalBookings, {
        one: m.bookings_count_one({ count: totalBookings }),
        few: m.bookings_count_few({ count: totalBookings }),
        many: m.bookings_count_many({ count: totalBookings }),
    });

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={styles.pageTitle}>{m.bookings_title()}</h2>
                <div className={styles.metaChips}>
                    <Button
                        variant="simple-filled"
                        className={styles.chipButton}
                    >
                        {formsLabel}
                    </Button>
                    <Button
                        variant="simple-filled"
                        className={styles.chipButton}
                    >
                        {bookingsLabel}
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
