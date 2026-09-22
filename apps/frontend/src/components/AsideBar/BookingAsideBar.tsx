import { type FC, useCallback } from 'react';
import { Button, Loader } from '@bookio/ui';
import { useGetBookingForms } from '#api/bookingForms/getBookingForms.ts';
import { organizationRouteApi } from '#lib/routeApis';
import { BookingFormAsideCard } from './BookingFormAsideCard.tsx';
import styles from './BookingAsideBar.module.scss';

export const BookingAsideBar: FC = () => {
    return (
        <aside className={styles.asideBar} aria-label="Booking forms">
            <h2 className={styles.title}>Booking forms</h2>
            <AsideBarContent />
        </aside>
    );
};

const AsideBarContent: FC = () => {
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

    if (isPending) {
        return (
            <div className={styles.state}>
                <div className={styles.loader}>
                    <Loader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.state}>
                <p className={styles.stateText}>{error.message}</p>
                <Button variant="primary-outlined" onClick={handleRetry}>
                    Retry
                </Button>
            </div>
        );
    }

    if (!bookingForms?.length) {
        return (
            <div className={styles.state}>
                <p className={styles.stateText}>No booking forms yet</p>
            </div>
        );
    }

    return (
        <ul className={styles.list}>
            {bookingForms.map((bookingForm) => (
                <li key={bookingForm.id}>
                    <BookingFormAsideCard bookingForm={bookingForm} />
                </li>
            ))}
        </ul>
    );
};
