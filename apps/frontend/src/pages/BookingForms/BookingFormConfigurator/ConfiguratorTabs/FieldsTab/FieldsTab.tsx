import { useParams } from 'react-router-dom';
import { Button, type ItemId, Reorder } from '@bookio/ui';

import styles from './FieldsTab.module.scss';
import { type FC, useCallback, useMemo, useState } from 'react';
import { FieldModal } from '#components/FieldModal/FieldModal.tsx';

import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore.ts';
import {
    moveBookingFormFieldToParent,
    reorderBookingFormSiblingFields,
} from '#utils/bookingFormFieldTree.ts';
import { useShallow } from 'zustand/shallow';

import { ConfiguratorField } from '#components/ConfiguratorField/ConfiguratorField.tsx';

export const FieldsTab: FC = () => {
    const { bookingFormId } = useParams();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
    const { setBookingFormFields, bookingFormFields, deleteBookingFormField } =
        useBookingFormConfiguratorStore(
            useShallow(
                ({
                    setBookingFormFields,
                    bookingFormFields,
                    deleteBookingFormField,
                }) => ({
                    setBookingFormFields,
                    bookingFormFields,
                    deleteBookingFormField,
                }),
            ),
        );

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
    }, []);

    const handleRootReorder = useCallback(
        (orderedIds: ItemId[]) => {
            if (!bookingFormFields || !bookingFormId) return;
            setBookingFormFields({
                bookingFormId,
                fields: reorderBookingFormSiblingFields(
                    bookingFormFields.fields,
                    null,
                    orderedIds,
                ),
            });
        },
        [bookingFormFields, bookingFormId, setBookingFormFields],
    );

    // Only plain fields can be dropped into a group — groups cannot nest.
    const isGroupDropTarget = useCallback(
        (draggedId: ItemId, targetId: ItemId) => {
            const fields = bookingFormFields?.fields;
            if (!fields) return false;
            const dragged = fields.find((field) => field.id === draggedId);
            const target = fields.find((field) => field.id === targetId);
            return (
                dragged !== undefined &&
                dragged.type !== 'group' &&
                target?.type === 'group'
            );
        },
        [bookingFormFields?.fields],
    );

    const handleDropIntoGroup = useCallback(
        (draggedId: ItemId, targetId: ItemId) => {
            if (!bookingFormFields || !bookingFormId) return;
            setBookingFormFields({
                bookingFormId,
                fields: moveBookingFormFieldToParent(
                    bookingFormFields.fields,
                    draggedId,
                    String(targetId),
                ),
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
                <Reorder
                    axis="y"
                    className={styles.fieldsList}
                    onReorder={handleRootReorder}
                    isDropTarget={isGroupDropTarget}
                    onDropInto={handleDropIntoGroup}
                >
                    {sortedFields.map(
                        ({ id, name, type, key, required, parentId }) => {
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
                        },
                    )}
                    <Button
                        variant="primary-outlined"
                        onClick={handleOpenCreateModal}
                    >
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
