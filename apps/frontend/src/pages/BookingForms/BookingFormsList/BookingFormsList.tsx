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
import { plural } from '#i18n/locale';
import { m } from '../../../paraglide/messages.js';

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
                    {m.retry()}
                </Button>
            </div>
        );
    }

    if (bookingForms.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.emptyContainerContent}>
                    <h2>{m.forms_empty()}</h2>
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
                    {m.forms_create_first()}
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
                <h2 className={styles.pageTitle}>{m.forms_title()}</h2>
                <div className={styles.metaChips}>
                    <Button
                        variant="simple-filled"
                        className={clsx(
                            styles.chipButton,
                            filter === 'all' && styles.chipButtonSelected,
                        )}
                        onClick={() => onFilterChange('all')}
                    >
                        {plural(formsCount, {
                            one: m.forms_count_one({ count: formsCount }),
                            few: m.forms_count_few({ count: formsCount }),
                            many: m.forms_count_many({ count: formsCount }),
                        })}
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
                        {plural(activeFormsCount, {
                            one: m.forms_active_one({ count: activeFormsCount }),
                            few: m.forms_active_few({ count: activeFormsCount }),
                            many: m.forms_active_many({ count: activeFormsCount }),
                        })}
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
                    {m.create()}
                </Button>
            </div>
        </div>
    );
};
