import type { FC } from 'react';
import styles from './ConfiguratorField.module.scss';
import { ConfiguratorField } from './ConfiguratorField';
import type { SyncBookingFormFieldItem } from '#utils/dataPreparers/bookingFormPreparers';
import { useConfiguratorFieldContext } from './ConfiguratorFieldContext';

interface ConfiguratorFieldGroupDataProps {
    childFields: SyncBookingFormFieldItem[];
}

export const ConfiguratorFieldGroupData: FC<ConfiguratorFieldGroupDataProps> = ({
    childFields,
}) => {
    const { onEdit, onDelete } = useConfiguratorFieldContext();

    return (
        <div className={styles.groupFieldsWrapper}>
            <div className={styles.groupFields}>
                {childFields.map((field) => (
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
                ))}
            </div>
        </div>
    );
};
