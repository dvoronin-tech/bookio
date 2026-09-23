import type { FC } from 'react';
import clsx from 'clsx';
import type { BookingFormType } from '#api/bookingForms/getBookingForms.ts';
import styles from './BookingAsideBar.module.scss';
import { bookingsRouteApi } from '#lib/routeApis.ts';
import { Link } from '@tanstack/react-router';

interface BookingFormAsideCardProps {
    bookingForm: BookingFormType;
}

export const BookingFormAsideCard: FC<BookingFormAsideCardProps> = ({
    bookingForm,
}) => {
    const { organizationId, bookingFormId } = bookingsRouteApi.useParams();

    const bookingsLabel =
        bookingForm.totalBookings === 1 ? 'booking' : 'bookings';

    const isActive = bookingForm.id === bookingFormId;

    return (
        <Link
            className={clsx(styles.card, { [styles.active]: isActive })}
            to="/$organizationId/bookings/$bookingFormId"
            params={{
                bookingFormId: bookingForm.id,
                organizationId,
            }}
        >
            <div className={styles.cardHeader}>
                <h3 className={styles.cardName}>{bookingForm.name}</h3>
                <span
                    className={clsx(styles.statusBadge, {
                        [styles.statusBadgeActive]: bookingForm.isActive,
                        [styles.statusBadgeInactive]: !bookingForm.isActive,
                    })}
                >
                    <span className={styles.statusDot} />
                    {bookingForm.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            {bookingForm.description && (
                <p className={styles.cardDescription}>
                    {bookingForm.description}
                </p>
            )}
            <p className={styles.cardMeta}>
                {bookingForm.totalBookings} {bookingsLabel}
            </p>
        </Link>
    );
};
