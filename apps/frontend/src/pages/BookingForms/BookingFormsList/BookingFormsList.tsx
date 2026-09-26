import { type FC, useCallback, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import styles from './BookingFormsList.module.scss';
import { useGetBookingForms } from '#api/bookingForms/getBookingForms.ts';
import { useNavigate } from '@tanstack/react-router';
import { organizationRouteApi } from '#lib/routeApis';
import { Button, PageLoader } from '@bookio/ui';
import { BookingFormCard } from '#components/BookingFormCard/BookingFormCard.tsx';
import { filterByIsActive } from './utils/filterByIsActive.ts';

import PlusIcon from '#assets/icons/plus.svg?react';

type BookingFormListFilter = 'all' | 'active';

export const BookingForms: FC = () => {
    const navigate = useNavigate();
    const { organizationId } = organizationRouteApi.useParams();
    const {
        data: bookingForms,
        isPending,
        error,
        refetch,
    } = useGetBookingForms(organizationId);

    const [filter, setFilter] = useState<BookingFormListFilter>('all');

    const handleRetry = useCallback(() => {
        void refetch();
    }, [refetch]);

    const filteredForms = useMemo(
        () => filterByIsActive(bookingForms ?? []),
        [bookingForms],
    );

    if (isPending) {
        return <PageLoader />;
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

    const visibleForms = filter === 'active' ? filteredForms : bookingForms;
    return (
        <>
            <BookingFormHeader
                formsCount={bookingForms.length}
                activeFormsCount={filteredForms.length}
                filter={filter}
                onFilterChange={setFilter}
            />
            <div className={styles.bookingForms}>
                {visibleForms.map((bookingForm) => (
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
    filter: BookingFormListFilter;
    onFilterChange: (filter: BookingFormListFilter) => void;
};

const BookingFormHeader: FC<BookingFormHeaderProps> = ({
    formsCount,
    activeFormsCount,
    filter,
    onFilterChange,
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
                        className={clsx(
                            styles.chipButton,
                            filter === 'all' && styles.chipButtonSelected,
                        )}
                        onClick={() => onFilterChange('all')}
                    >
                        {formsCount} forms
                    </Button>
                    <Button
                        variant="simple-filled"
                        className={clsx(
                            styles.chipButton,
                            filter === 'active' && styles.chipButtonSelected,
                        )}
                        onClick={() => onFilterChange('active')}
                    >
                        <span className={styles.activeDot} aria-hidden />
                        {activeFormsCount} active
                    </Button>
                </div>
            </div>

            <div className={styles.headerToolbar}>
                {/*<Input.Root className={styles.searchInput}>*/}
                {/*    <Input.Icon>*/}
                {/*        <SearchIcon />*/}
                {/*    </Input.Icon>*/}
                {/*    <Input*/}
                {/*        type="search"*/}
                {/*        placeholder="Search forms…"*/}
                {/*        aria-label="Search forms"*/}
                {/*        readOnly*/}
                {/*    />*/}
                {/*</Input.Root>*/}

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
