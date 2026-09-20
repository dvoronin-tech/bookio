import { type FC, useCallback } from 'react';
import styles from './BookingFormsList.module.scss';
import { useGetBookingForms } from '#api/bookingForms/getBookingForms.ts';
import { useNavigate } from '@tanstack/react-router';
import { organizationRouteApi } from '#lib/routeApis';
import { Button, Input, Loader } from '@bookio/ui';
import { BookingFormCard } from '#components/BookingFormCard/BookingFormCard.tsx';

import PlusIcon from '#assets/icons/plus.svg?react';
import SearchIcon from '#assets/icons/search.svg?react';

export const BookingForms: FC = () => {
    const navigate = useNavigate();
    const { organizationId } = organizationRouteApi.useParams();
    const {
        data: bookingForms,
        isPending,
        error,
        refetch,
    } = useGetBookingForms(organizationId);

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    if (isPending) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <h2>{error.message}</h2>
                <Button variant="primary-outlined" onClick={handleRetry}>
                    Retry
                </Button>
            </div>
        );
    }

    if (bookingForms.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.emptyContainerContent}>
                    <h2>You haven't any booking forms yet</h2>
                    <p>Create your first booking form to get started</p>
                </div>
                <Button
                    variant="primary-filled"
                    className={styles.createButton}
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

    const activeFormsCount = bookingForms.filter(
        (form) => form.isActive,
    ).length;

    return (
        <>
            <BookingFormHeader
                formsCount={bookingForms.length}
                activeFormsCount={activeFormsCount}
            />
            <div className={styles.bookingForms}>
                {bookingForms.map((bookingForm) => (
                    <BookingFormCard
                        key={bookingForm.id}
                        bookingForm={bookingForm}
                    />
                ))}
            </div>
        </>
    );
};

type BookingFormHeaderProps = {
    formsCount: number;
    activeFormsCount: number;
};

const BookingFormHeader: FC<BookingFormHeaderProps> = ({
    formsCount,
    activeFormsCount,
}) => {
    const navigate = useNavigate();
    const { organizationId } = organizationRouteApi.useParams();

    return (
        <div className={styles.bookingHeader}>
            <div className={styles.headerLeft}>
                <h2 className={styles.pageTitle}>Booking Forms</h2>
                <div className={styles.metaChips}>
                    <Button
                        variant="simple-filled"
                        className={styles.chipButton}
                    >
                        {formsCount} forms
                    </Button>
                    <Button
                        variant="simple-filled"
                        className={styles.chipButton}
                    >
                        <span className={styles.activeDot} aria-hidden />
                        {activeFormsCount} active
                    </Button>
                </div>
            </div>

            <div className={styles.headerToolbar}>
                <Input.Root className={styles.searchInput}>
                    <Input.Icon>
                        <SearchIcon />
                    </Input.Icon>
                    <Input
                        type="search"
                        placeholder="Search forms…"
                        aria-label="Search forms"
                        readOnly
                    />
                </Input.Root>

                <Button
                    variant="primary-filled"
                    className={styles.headerCreateButton}
                    onClick={() =>
                        void navigate({
                            to: '/$organizationId/booking-forms/create',
                            params: { organizationId },
                        })
                    }
                >
                    <PlusIcon />
                    Create
                </Button>
            </div>
        </div>
    );
};
