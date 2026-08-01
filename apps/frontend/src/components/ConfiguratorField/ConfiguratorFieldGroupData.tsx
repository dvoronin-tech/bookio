import { useCallback, type FC } from 'react';
import styles from './ConfiguratorField.module.scss';
import { ConfiguratorField } from './ConfiguratorField';
import {
    reorderBookingFormSiblingFields,
    type SyncBookingFormFieldItem,
} from '#utils/dataPreparers/bookingFormPreparers';
import { useConfiguratorFieldContext } from './ConfiguratorFieldContext';
import { Reorder, type ItemId } from '@bookio/ui';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { useShallow } from 'zustand/shallow';

interface ConfiguratorFieldGroupDataProps {
    childFields: SyncBookingFormFieldItem[];
}

export const ConfiguratorFieldGroupData: FC<ConfiguratorFieldGroupDataProps> = ({
    childFields,
}) => {
    const { onEdit, onDelete } = useConfiguratorFieldContext();
    const { setBookingFormFields, bookingFormFields } = useBookingFormConfiguratorStore(
        useShallow(({ setBookingFormFields, bookingFormFields }) => ({
            setBookingFormFields,
            bookingFormFields,
        })),
    );

    const handleReorder = useCallback(
        (orderedIds: ItemId[]) => {
            if (!bookingFormFields) return;
            const parentId = childFields[0]?.parentId ?? null;
            setBookingFormFields({
                bookingFormId: bookingFormFields.bookingFormId,
                fields: reorderBookingFormSiblingFields(
                    bookingFormFields.fields,
                    parentId,
                    orderedIds,
                ),
            });
        },
        [bookingFormFields, childFields, setBookingFormFields],
    );

    return (
        <div className={styles.groupFieldsWrapper}>
            <Reorder axis="y" className={styles.groupFields} onReorder={handleReorder}>
                {childFields.map((field) => (
                    <Reorder.Item itemId={field.id} key={field.id}>
                        <ConfiguratorField
                            parentId={field.parentId}
                            key={field.id}
                            fieldId={field.id}
                            fieldKey={field.key}
                            type={field.type}
                            name={field.name}
                            required={field.required}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            fields={childFields}
                        />
                    </Reorder.Item>
                ))}
            </Reorder>
        </div>
    );
};
