import { type FC, useLayoutEffect } from 'react';
import { clsx } from 'clsx';
import { useShallow } from 'zustand/shallow';

import { ConfiguratorLayout } from './ConfiguratorLayout/ConfiguratorLayout.tsx';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore.ts';
import { getConfiguratorTab } from './configuratorTabs.tsx';
import { BookingFormPreview } from '#components/BookingFormPreview/BookingFormPreview.tsx';
import { useGetBookingForm } from '#api/bookingForms/getBookingForm.ts';
import { configuratorRouteApi } from '#lib/routeApis';
import { toDefaultBookingFormData } from '#utils/dataPreparers/bookingFormPreparers.ts';
import { Button, PageLoader } from '@bookio/ui';
import PanelLeftOpenIcon from '#assets/icons/panel-left-open.svg?react';
import styles from './BookingFormConfigurator.module.scss';

export const BookingFormConfigurator: FC = () => {
    const { bookingFormId } = configuratorRouteApi.useParams();
    const {
        setDefaultBookingFormData,
        isSeeded,
        activeTab,
        isCollapsed,
        setIsCollapsed,
    } = useBookingFormConfiguratorStore(
        useShallow((state) => ({
            setDefaultBookingFormData: state.setDefaultBookingFormData,
            isSeeded: state.bookingForm?.id === bookingFormId,
            activeTab: state.activeTab,
            isCollapsed: state.isCollapsed,
            setIsCollapsed: state.setIsCollapsed,
        })),
    );

    const {
        data: bookingForm,
        isLoading: isBookingFormLoading,
        isError: isBookingFormError,
        error: bookingFormError,
        refetch: refetchBookingForm,
    } = useGetBookingForm(bookingFormId);

    useLayoutEffect(() => {
        if (!bookingForm) return;

        setDefaultBookingFormData(toDefaultBookingFormData(bookingForm));
    }, [bookingForm, setDefaultBookingFormData]);

    const tab = getConfiguratorTab(activeTab);
    const Panel = tab?.Panel;

    if (isBookingFormLoading) {
        return <PageLoader />;
    }

    const handleRefetchBookingForm = () => {
        void refetchBookingForm();
    };

    if (!bookingForm) {
        if (isBookingFormError) {
            return (
                <div className={styles.errorContainer}>
                    <h2>
                        {bookingFormError?.message ||
                            'An error occurred while fetching the data'}
                    </h2>
                    <Button
                        variant="primary-outlined"
                        onClick={handleRefetchBookingForm}
                    >
                        Retry
                    </Button>
                </div>
            );
        }

        return <PageLoader />;
    }

    if (!isSeeded) {
        return <PageLoader />;
    }

    return (
        <div className={styles.bookingFormConfigurator}>
            <button
                type="button"
                className={clsx(styles.expandButton, {
                    [styles.expandButtonVisible]: isCollapsed,
                })}
                onClick={() => setIsCollapsed(false)}
            >
                <PanelLeftOpenIcon />
            </button>
            <ConfiguratorLayout>{Panel ? <Panel /> : null}</ConfiguratorLayout>
            <div className={styles.configuratorPreview}>
                <BookingFormPreview />
            </div>
        </div>
    );
};
