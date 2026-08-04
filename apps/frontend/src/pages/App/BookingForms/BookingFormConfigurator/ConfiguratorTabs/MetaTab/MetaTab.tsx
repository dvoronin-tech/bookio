import { useEffect, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { guardConfiguratorRoute } from '#navigation';
import {
    useGetEntireBookingFormById,
    type EntireBookingFormType,
} from '#api/bookingForms/getEntireBookingFormById';
import { useGetOrganization } from '#api/organizations/getOrganizationData';
import { Spinner } from '#components/Spinner/Spinner';
import { Button } from '@bookio/ui';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';

import styles from './MetaTab.module.scss';

type MetaTabFormProps = {
    bookingFormId: string;
    formMeta: EntireBookingFormType['metaData'];
};

const MetaTabForm: FC<MetaTabFormProps> = ({ bookingFormId, formMeta }) => {
    const bookingFormMeta = useBookingFormConfiguratorStore((state) => state.bookingFormMeta);
    const setBookingFormMeta = useBookingFormConfiguratorStore((state) => state.setBookingFormMeta);

    // Seed from server once per form. Do not overwrite local drafts on tab remount / refetch.
    useEffect(() => {
        if (bookingFormMeta?.bookingFormId === bookingFormId) return;
        if (!formMeta) return;

        setBookingFormMeta({
            bookingFormId,
            title: formMeta.title,
            description: formMeta.description,
            additionalMetaData: formMeta.additionalMetaData ?? {},
        });
    }, [bookingFormId, formMeta, bookingFormMeta, setBookingFormMeta]);

    if (!bookingFormId) {
        return null;
    }

    // UI for meta editing will be added later
    return null;
};

export const MetaTab = () => {
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
        <MetaTabForm bookingFormId={routeParams.bookingFormId} formMeta={bookingForm.metaData} />
    );
};
