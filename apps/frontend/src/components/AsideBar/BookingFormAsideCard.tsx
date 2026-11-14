import type { FC } from 'react';
import clsx from 'clsx';
import type { BookingFormType } from '#api/bookingForms/getBookingForms.ts';
import styles from './BookingAsideBar.module.scss';
import { bookingsRouteApi } from '#lib/routeApis.ts';
import { Link } from '@tanstack/react-router';
import { plural } from '#i18n/locale';
import { m } from '../../paraglide/messages.js';

interface BookingFormAsideCardProps {
    bookingForm: BookingFormType;
}

export const BookingFormAsideCard: FC<BookingFormAsideCardProps> = ({
    bookingForm,
}) => {
    const { organizationId, bookingFormId } = bookingsRouteApi.useParams();

    const bookingsLabel = plural(bookingForm.totalBookings, {
        one: m.bookings_count_one({ count: bookingForm.totalBookings }),
        few: m.bookings_count_few({ count: bookingForm.totalBookings }),
        many: m.bookings_count_many({ count: bookingForm.totalBookings }),
    });

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
                    {bookingForm.isActive ? m.active() : m.inactive()}
                </span>
            </div>
            {bookingForm.description && (
                <p className={styles.cardDescription}>
                    {bookingForm.description}
                </p>
            )}
            <p className={styles.cardMeta}>
                {bookingsLabel}
            </p>
        </Link>
    );
};
