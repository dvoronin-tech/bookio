import { type FC, type MouseEvent, useCallback, useState } from 'react';
import styles from './BookingFormCard.module.scss';
import type { BookingFormType } from '#api/bookingForms/getBookingForms';
import { Button } from '@bookio/ui';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { DeleteBookingFormDialog } from './DeleteBookingFormDialog';
import { BOOKING_FORM_URL } from '#utils/constants';
import { copyToClipboard } from '#utils/copyToClipboard.ts';

import TrashIcon from '#assets/icons/trash.svg?react';
import CalendarIcon from '#assets/icons/calendar.svg?react';
import CopyIcon from '#assets/icons/copy.svg?react';

import { useNavigate } from '@tanstack/react-router';
import { organizationRouteApi } from '#lib/routeApis';
import { useGetOrganization } from '#api/organizations/getOrganizationData';

const throwNoOrgToast = () =>
    toast.error("Organization slug haven't loaded yet");

export const BookingFormCard: FC<{ bookingForm: BookingFormType }> = ({
    bookingForm,
}) => {
    const navigate = useNavigate();
    const { organizationId } = organizationRouteApi.useParams();
    const { data: organization } = useGetOrganization(organizationId);
    const [isDeleting, setIsDeleting] = useState(false);

    const slug = organization?.slug;

    const bookingFormUrl = `${BOOKING_FORM_URL}/${slug ?? 'LOADING'}/${bookingForm.slug}`;

    const handleOpenDeleteDialog = useCallback(() => {
        setIsDeleting(true);
    }, []);

    const handleCopyBookingFormUrl = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();

            if (slug) {
                copyToClipboard(bookingFormUrl, 'Booking form URL');
            } else {
                throwNoOrgToast();
            }
        },
        [bookingFormUrl, slug],
    );

    const handleNavigateToBookingForm = useCallback(() => {
        if (slug) {
            window.open(bookingFormUrl, '_blank');
        } else {
            throwNoOrgToast();
        }
    }, [bookingFormUrl, slug]);

    const handleOpenConfigurator = useCallback(() => {
        void navigate({
            to: '/$organizationId/booking-forms/$bookingFormId/configurator',
            params: { organizationId, bookingFormId: bookingForm.id },
        });
    }, [navigate, organizationId, bookingForm.id]);

    return (
        <>
            <div className={styles.bookingFormCard}>
                <div className={styles.contentGroup}>
                    <div className={styles.cardHeader}>
                        <div className={styles.titleRow}>
                            <h3 className={styles.formName}>
                                {bookingForm.name}
                            </h3>
                            <span
                                className={clsx(styles.statusBadge, {
                                    [styles.statusBadgeActive]:
                                        bookingForm.isActive,
                                    [styles.statusBadgeInactive]:
                                        !bookingForm.isActive,
                                })}
                            >
                                <span className={styles.statusDot} />
                                <span>
                                    {bookingForm.isActive
                                        ? 'Active'
                                        : 'Inactive'}
                                </span>
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
                            <span className={styles.urlLabel}>
                                Booking form URL
                            </span>
                            <a
                                className={styles.urlRow}
                                onClick={handleNavigateToBookingForm}
                            >
                                <span className={styles.urlText}>
                                    {bookingFormUrl}
                                </span>
                                <button
                                    type="button"
                                    className={styles.copyButton}
                                    onClick={handleCopyBookingFormUrl}
                                    aria-label="Copy booking form URL"
                                >
                                    <CopyIcon />
                                </button>
                            </a>
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
                        className={styles.bookingFormCardConfiguratorButton}
                        onClick={handleOpenConfigurator}
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
