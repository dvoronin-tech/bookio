import type { FC } from 'react';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { format } from 'date-fns';
import type { BookingFormType } from '#api/bookingForms/getBookingForms.ts';
import styles from './BookingFormTile.module.scss';

import CalendarIcon from '#assets/icons/calendar.svg?react';
import { dateFnsLocale, plural } from '#i18n/locale';
import { m } from '#i18n/messages';

interface BookingFormTileProps {
    organizationId: string;
    bookingForm: BookingFormType;
}

export const BookingFormTile: FC<BookingFormTileProps> = ({
    organizationId,
    bookingForm,
}) => {
    const totalLabel = plural(bookingForm.totalBookings, {
        one: m.total_bookings_one(),
        few: m.total_bookings_few(),
        many: m.total_bookings_many(),
    });

    return (
        <Link
            className={styles.tile}
            to="/$organizationId/bookings/$bookingFormId"
            params={{
                organizationId,
                bookingFormId: bookingForm.id,
            }}
        >
            <div className={styles.header}>
                <h3 className={styles.name}>{bookingForm.name}</h3>
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

            <p className={styles.description}>
                {bookingForm.description || m.step5_no_description()}
            </p>

            <div className={styles.stat}>
                <div className={styles.statLabel}>
                    <CalendarIcon className={styles.statIcon} />
                    <span>{totalLabel}</span>
                </div>
                <span className={styles.statValue}>
                    {bookingForm.totalBookings}
                </span>
            </div>

            <div className={styles.footer}>
                <span className={styles.createdAt}>
                    {m.tile_created({
                        date: format(new Date(bookingForm.createdAt), 'dd/MM/yyyy', {
                            locale: dateFnsLocale(),
                        }),
                    })}
                </span>
            </div>
        </Link>
    );
};
