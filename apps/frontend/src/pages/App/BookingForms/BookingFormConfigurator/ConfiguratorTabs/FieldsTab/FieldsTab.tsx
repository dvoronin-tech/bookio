import { useNavigate, useParams } from 'react-router-dom';
import {
    useGetEntireBookingFormById,
    type EntireBookingFormType,
} from '#api/bookingForms/getEntireBookingFormById';
import { useGetOrganization } from '#api/organizations/getOrganizationData';
import { Spinner } from '#components/Spinner/Spinner';
import { Button, Reorder, type ItemId } from '@bookio/ui';

import styles from './FieldsTab.module.scss';
import { useState, type FC, useCallback, useEffect, useMemo } from 'react';
import { FieldModal } from '#components/FieldModal/FieldModal';

import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import {
    reorderBookingFormSiblingFields,
    toSyncBookingFormFieldsRequest,
} from '#utils/dataPreparers/bookingFormPreparers';
import { useShallow } from 'zustand/shallow';

import { ConfiguratorField } from '#components/ConfiguratorField/ConfiguratorField';

interface FieldsTabFormProps {
    bookingFormId: string;
    fields: EntireBookingFormType['fields'];
}

const FieldsTabForm: FC<FieldsTabFormProps> = ({ bookingFormId, fields }) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
    const { setBookingFormFields, bookingFormFields, deleteBookingFormField } =
        useBookingFormConfiguratorStore(
            useShallow(({ setBookingFormFields, bookingFormFields, deleteBookingFormField }) => ({
                setBookingFormFields,
                bookingFormFields,
                deleteBookingFormField,
            })),
        );
    // Seed from server once per form. Do not overwrite local drafts on tab remount / refetch.
    useEffect(() => {
        if (bookingFormFields?.bookingFormId === bookingFormId) return;

        setBookingFormFields(toSyncBookingFormFieldsRequest(bookingFormId, fields));
    }, [bookingFormId, fields, bookingFormFields, setBookingFormFields]);

    const handleOpenCreateModal = useCallback(() => {
        setEditingFieldId(null);
        setIsOpenModal(true);
    }, []);

    const handleEditField = useCallback((fieldId: string) => {
        setEditingFieldId(fieldId);
        setIsOpenModal(true);
    }, []);

    const handleModalOpenChange = useCallback((open: boolean) => {
        setIsOpenModal(open);
        if (!open) setEditingFieldId(null);
    }, []);

    const handleRootReorder = useCallback(
        (orderedIds: ItemId[]) => {
            if (!bookingFormFields) return;
            setBookingFormFields({
                bookingFormId,
                fields: reorderBookingFormSiblingFields(bookingFormFields.fields, null, orderedIds),
            });
        },
        [bookingFormFields, bookingFormId, setBookingFormFields],
    );

    const sortedFields = useMemo(() => {
        const fields = bookingFormFields?.fields ?? [];
        return [...fields].sort((a, b) => a.order - b.order);
    }, [bookingFormFields?.fields]);

    if (!bookingFormId) {
        return null;
    }

    return (
        <>
            <div className={styles.fieldsTab}>
                <Reorder axis="y" className={styles.fieldsList} onReorder={handleRootReorder}>
                    {sortedFields.map(({ id, name, type, key, required, parentId }) => {
                        if (parentId) return null;
                        return (
                            <Reorder.Item key={id} itemId={id}>
                                <ConfiguratorField
                                    key={id}
                                    fieldId={id}
                                    name={name}
                                    fieldKey={key}
                                    type={type}
                                    required={required}
                                    onEdit={handleEditField}
                                    onDelete={deleteBookingFormField}
                                    parentId={parentId}
                                    fields={sortedFields}
                                    isRoot
                                />
                            </Reorder.Item>
                        );
                    })}
                    <Button variant="primary-outlined" onClick={handleOpenCreateModal}>
                        Add field
                    </Button>
                </Reorder>
            </div>
            <FieldModal
                open={isOpenModal}
                onOpenChange={handleModalOpenChange}
                bookingFormId={bookingFormId}
                fieldId={editingFieldId}
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
