import { type FC, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { ConfiguratorLayout } from './ConfiguratorLayout/ConfiguratorLayout';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { getConfiguratorTab } from './configuratorTabs';
import { useGetEntireBookingFormById } from '#api/bookingForms/getEntireBookingFormById';
import { guardConfiguratorRoute } from '#navigation';
import { toDefaultBookingFormData } from '#utils/dataPreparers/bookingFormPreparers';
import { Loader } from '#components/Loader/Loader';
import { Button } from '@bookio/ui';
import styles from './BookingFormConfigurator.module.scss';

export const BookingFormConfigurator: FC = () => {
    const { bookingFormId, organizationId } = useParams();
    const navigate = useNavigate();
    const { setDefaultBookingFormData, isSeeded, activeTab } = useBookingFormConfiguratorStore(
        useShallow((state) => ({
            setDefaultBookingFormData: state.setDefaultBookingFormData,
            isSeeded: state.bookingForm?.bookingFormId === bookingFormId,
            activeTab: state.activeTab,
        })),
    );

    const {
        data: bookingForm,
        isLoading: isBookingFormLoading,
        isError: isBookingFormError,
        error: bookingFormError,
        refetch: refetchBookingForm,
    } = useGetEntireBookingFormById(bookingFormId);

    const routeParams = guardConfiguratorRoute(navigate, organizationId, bookingFormId);

    useLayoutEffect(() => {
        if (!bookingForm) return;

        setDefaultBookingFormData(toDefaultBookingFormData(bookingForm));
    }, [bookingForm, setDefaultBookingFormData]);

    const tab = getConfiguratorTab(activeTab);
    const Panel = tab?.Panel;

    if (!routeParams) {
        return null;
    }

    if (isBookingFormLoading) {
        return <Loader />;
    }

    const handleRefetchBookingForm = () => {
        refetchBookingForm();
    };

    if (!bookingForm) {
        if (isBookingFormError) {
            return (
                <div className={styles.errorContainer}>
                    <h2>
                        {bookingFormError?.message || 'An error occurred while fetching the data'}
                    </h2>
                    <Button variant="primary-outlined" onClick={handleRefetchBookingForm}>
                        Retry
                    </Button>
                </div>
            );
        }

        return <Loader />;
    }

    if (!isSeeded) {
        return <Loader />;
    }

    return (
        <div className={styles.bookingFormConfigurator}>
            <ConfiguratorLayout>{Panel ? <Panel /> : null}</ConfiguratorLayout>
            <div className={styles.configuratorPreview}></div>
        </div>
    );
};
