import { useNavigate, useParams } from 'react-router-dom';
import { guardConfiguratorRoute } from '#navigation';
import { useGetEntireBookingFormById } from '#api/bookingForms/getEntireBookingFormById';
import { useGetOrganization } from '#api/organizations/getOrganizationData';
import { StylesTabForm } from '#components/BookingFormStyles/StylesTabForm/StylesTabForm';
import { Spinner } from '#components/Spinner/Spinner';
import { Button } from '@bookio/ui';

import styles from './StylesTab.module.scss';

export const StylesTab = () => {
    const { bookingFormId, id } = useParams();
    const navigate = useNavigate();

    const {
        data: organization,
        isLoading: isOrganizationLoading,
        isError: isOrganizationError,
        error: organizationError,
        refetch: refetchOrganization,
    } = useGetOrganization(id);
    const {
        data: bookingForm,
        isLoading: isBookingFormLoading,
        isError: isBookingFormError,
        error: bookingFormError,
        refetch: refetchBookingForm,
    } = useGetEntireBookingFormById(bookingFormId);

    const routeParams = guardConfiguratorRoute(navigate, id, bookingFormId);

    if (!routeParams) {
        return null;
    }

    if (isOrganizationLoading || isBookingFormLoading)
        return (
            <div className={styles.loadingContainer}>
                <Spinner />
            </div>
        );

    if (!organization || !bookingForm) {
        if (isOrganizationError || isBookingFormError) {
            console.error({ organizationError }, { bookingFormError });
            const refetchData = () => {
                if (isOrganizationError) {
                    void refetchOrganization();
                }
                if (isBookingFormError) {
                    void refetchBookingForm();
                }
            };

            return (
                <div className={styles.errorContainer}>
                    <h2>
                        {organizationError?.message ||
                            bookingFormError?.message ||
                            'An error occurred while fetching the data'}
                    </h2>
                    <Button variant="primary-outlined" onClick={refetchData}>
                        Retry
                    </Button>
                </div>
            );
        }
        return (
            <div className={styles.loadingContainer}>
                <Spinner />
            </div>
        );
    }

    return (
        <StylesTabForm
            bookingFormId={routeParams.bookingFormId}
            formStyles={bookingForm.styles}
        />
    );
};
