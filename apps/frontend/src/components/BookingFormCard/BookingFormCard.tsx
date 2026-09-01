import { useCallback, type FC, useState, type MouseEvent } from 'react';
import styles from './BookingFormCard.module.scss';
import type { BookingFormType } from '#api/bookingForms/getBookingForms';
import { Button } from '@bookio/ui';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { DeleteBookingFormDialog } from './DeleteBookingFormDialog';
import { BOOKING_FORM_URL } from '#utils/constants';

import TrashIcon from '#assets/icons/trash.svg?react';
import CalendarIcon from '#assets/icons/calendar.svg?react';
import CopyIcon from '#assets/icons/copy.svg?react';

import { useParams } from 'react-router-dom';
import { useGetOrganization } from '#api/organizations/getOrganizationData';

export const BookingFormCard: FC<{ bookingForm: BookingFormType }> = ({ bookingForm }) => {
    const { id } = useParams<{ id: string }>();
    const { data: organization } = useGetOrganization(id);
    const [isDeleting, setIsDeleting] = useState(false);

    const bookingFormUrl = `${BOOKING_FORM_URL}/${organization?.slug}/${bookingForm.slug}`;

    const handleOpenDeleteDialog = useCallback(() => {
        setIsDeleting(true);
    }, []);

    const handleCopyBookingFormUrl = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(bookingFormUrl);
        toast.success('Booking form URL copied to clipboard');
    }, [bookingFormUrl]);

    const handleNavigateToBookingForm = useCallback(() => {
        window.open(bookingFormUrl, '_blank');
    }, [bookingFormUrl]);

    return (
        <>
            <div className={styles.bookingFormCard}>
                <div className={styles.contentGroup}>
                    <div className={styles.cardHeader}>
                        <div className={styles.titleRow}>
                            <h3 className={styles.formName}>{bookingForm.name}</h3>
                            <span
                                className={clsx(styles.statusBadge, {
                                    [styles.statusBadgeActive]: bookingForm.isActive,
                                    [styles.statusBadgeInactive]: !bookingForm.isActive,
                                })}
                            >
                                <span className={styles.statusDot} />
                                <span>{bookingForm.isActive ? 'Active' : 'Inactive'}</span>
                            </span>
                        </div>
                        <p className={styles.formDescription}>
                            {bookingForm.description || '\u00A0'}
                        </p>
                    </div>

                    <div className={styles.cardMeta}>
                        <div className={styles.metricRow}>
                            <div className={styles.metricLeft}>
                                <CalendarIcon className={styles.metricIcon} />
                                <span>Bookings this month</span>
                            </div>
                            <span className={styles.bookingsCount}>
                                {bookingForm.totalBookings}
                            </span>
                        </div>

                        <div className={styles.urlBlock}>
                            <span className={styles.urlLabel}>Booking form URL</span>
                            <button className={styles.urlRow} onClick={handleNavigateToBookingForm}>
                                <span className={styles.urlText}>{bookingFormUrl}</span>
                                <button
                                    type="button"
                                    className={styles.copyButton}
                                    onClick={handleCopyBookingFormUrl}
                                    aria-label="Copy booking form URL"
                                >
                                    <CopyIcon />
                                </button>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.bookingFormButtonsGroup}>
                    <Button
                        variant="red-clean"
                        onClick={handleOpenDeleteDialog}
                        className={styles.bookingFormCardButton}
                        aria-label="Delete booking form"
                    >
                        <TrashIcon />
                    </Button>
                    <Button
                        variant="simple-filled"
                        type="link"
                        to={`${bookingForm.id}/configurator`}
                        className={styles.bookingFormCardConfiguratorButton}
                    >
                        Open configurator
                    </Button>
                </div>
            </div>

            <DeleteBookingFormDialog
                bookingForm={bookingForm}
                open={isDeleting}
                onOpenChange={setIsDeleting}
            />
        </>
    );
};
