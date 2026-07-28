import { useNavigate, useParams } from 'react-router-dom';
import {
    useGetEntireBookingFormById,
    type EntireBookingFormType,
} from '#api/bookingForms/getEntireBookingFormById';
import { useGetOrganization } from '#api/organizations/getOrganizationData';
import { Spinner } from '#components/Spinner/Spinner';
import { Button } from '@bookio/ui';

import styles from './FieldsTab.module.scss';
import { useState, type FC, useCallback, useEffect } from 'react';
import { CreateFieldModal } from './CreateFieldModal/CreateFieldModal';

import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { toSyncBookingFormFieldsRequest } from '#utils/bookingFormFieldMappers';
import { useShallow } from 'zustand/shallow';

import { ConfiguratorField } from '#components/ConfiguratorField/ConfiguratorField';

interface FieldsTabFormProps {
    bookingFormId: string;
    fields: EntireBookingFormType['fields'];
}

const FieldsTabForm: FC<FieldsTabFormProps> = ({ bookingFormId, fields }) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const { setBookingFormFields, bookingFormFields, deleteBookingFormField } =
        useBookingFormConfiguratorStore(
            useShallow(({ setBookingFormFields, bookingFormFields, deleteBookingFormField }) => ({
                setBookingFormFields,
                bookingFormFields,
                deleteBookingFormField,
            })),
        );

    useEffect(() => {
        setBookingFormFields(toSyncBookingFormFieldsRequest(bookingFormId, fields));
    }, []);

    const handleOpenModal = useCallback(() => {
        setIsOpenModal(true);
    }, [setIsOpenModal]);

    if (!bookingFormId) {
        return null;
    }

    return (
        <>
            <div className={styles.fieldsTab}>
                <div className={styles.fieldsList}>
                    {bookingFormFields &&
                        bookingFormFields.fields.map(({ id, name, type, key }) => (
                            <ConfiguratorField
                                key={id}
                                fieldId={id}
                                name={name}
                                fieldKey={key}
                                type={type}
                                onDelete={deleteBookingFormField}
                            />
                        ))}
                    <Button variant="primary-outlined" onClick={handleOpenModal}>
                        Add field
                    </Button>
                </div>
            </div>
            <CreateFieldModal
                open={isOpenModal}
                onOpenChange={setIsOpenModal}
                bookingFormId={bookingFormId}
                existingFields={fields}
            />
        </>
    );
};

export const FieldsTab = () => {
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

    if (!id) {
        navigate('/organizations/list');
        return null;
    }

    if (!bookingFormId) {
        navigate(`/${id}/booking-forms`);
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

    return <FieldsTabForm bookingFormId={bookingFormId} fields={bookingForm.fields} />;
};
