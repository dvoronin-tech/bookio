import type { FC } from 'react';
import styles from './ConfiguratorField.module.scss';
import { ConfiguratorField } from './ConfiguratorField';
import type { SyncBookingFormFieldItem } from '#utils/dataPreparers/bookingFormPreparers';
import { useConfiguratorFieldContext } from './ConfiguratorFieldContext';
import { Reorder } from '@bookio/ui';

interface ConfiguratorFieldGroupDataProps {
    childFields: SyncBookingFormFieldItem[];
}

export const ConfiguratorFieldGroupData: FC<ConfiguratorFieldGroupDataProps> = ({
    childFields,
}) => {
    const { onEdit, onDelete } = useConfiguratorFieldContext();

    return (
        <div className={styles.groupFieldsWrapper}>
            <Reorder axis="y" className={styles.groupFields}>
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
