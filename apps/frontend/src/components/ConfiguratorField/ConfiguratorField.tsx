import { useCallback, type FC, memo, useMemo } from 'react';

import styles from './ConfiguratorField.module.scss';

import { clsx } from 'clsx';
import { ConfiguratorFieldActions } from './ConfiguratorFieldActions';
import { ConfiguratorFieldDragHandle } from './ConfiguratorFieldDragHandle';
import { ConfiguratorFieldInfo } from './ConfiguratorFieldInfo';
import { ConfiguratorFieldTypeBadge } from './ConfiguratorFieldTypeBadge';
import { ConfiguratorFieldGroupData } from './ConfiguratorFieldGroupData';
import type { SyncBookingFormFieldItem } from '#utils/dataPreparers/bookingFormPreparers';
import {
    ConfiguratorFieldContext,
    type ConfiguratorFieldContextValue,
    useConfiguratorFieldContext,
} from './ConfiguratorFieldContext';

export interface ConfiguratorFieldProps {
    name: string;
    type: SyncBookingFormFieldItem['type'];
    fieldKey: string;
    required?: boolean;
    onEdit?: (fieldId: string) => void;
    onDelete?: (fieldId: string) => void;
    fieldId: string;
    parentId: string | null;
    isRoot?: boolean;
    fields: SyncBookingFormFieldItem[];
}

export const ConfiguratorField: FC<ConfiguratorFieldProps> = ({
    name,
    type,
    fieldKey,
    required,
    onEdit,
    onDelete,
    fieldId,
    parentId,
    fields,
    isRoot,
}) => {
    const contextValue = useMemo<ConfiguratorFieldContextValue>(
        () => ({
            onEdit,
            onDelete,
            fields,
        }),
        [onEdit, onDelete, fields],
    );

    if (parentId !== null && isRoot) return null;

    return (
        <ConfiguratorFieldContext.Provider value={contextValue}>
            {type === 'group' ? (
                <ConfiguratorGroupItem
                    fieldId={fieldId}
                    required={required}
                    name={name}
                    fieldKey={fieldKey}
                    type={type}
                />
            ) : (
                <ConfiguratorFieldItem
                    fieldId={fieldId}
                    required={required}
                    name={name}
                    fieldKey={fieldKey}
                    type={type}
                />
            )}
        </ConfiguratorFieldContext.Provider>
    );
};

interface ConfiguratorItemProps {
    fieldId: string;
    name: string;
    fieldKey: string;
    type: SyncBookingFormFieldItem['type'];
    required?: boolean;
}

const ConfiguratorGroupItem: FC<ConfiguratorItemProps> = memo(
    ({ fieldId, type, required, name, fieldKey }) => {
        const { onEdit, fields, onDelete } = useConfiguratorFieldContext();

        const childFields = useMemo(() => {
            if (!fields) return [];
            return fields
                .filter((field) => field.parentId === fieldId)
                .sort((a, b) => a.order - b.order);
        }, [fields, fieldId]);

        const handleDelete = useCallback(() => {
            onDelete?.(fieldId);
        }, [onDelete, fieldId]);

        const handleEdit = useCallback(() => {
            onEdit?.(fieldId);
        }, [onEdit, fieldId]);

        return (
            <div className={clsx(styles.configuratorField, styles.group)} data-field-id={fieldId}>
                <div className={styles.groupData}>
                    <ConfiguratorFieldDragHandle fieldId={fieldId} />
                    <div className={styles.content}>
                        <ConfiguratorFieldTypeBadge type={type} />
                        <ConfiguratorFieldInfo
                            name={name}
                            fieldKey={fieldKey}
                            required={required}
                        />
                        <ConfiguratorFieldActions onEdit={handleEdit} onDelete={handleDelete} />
                    </div>
                </div>
                {childFields.length > 0 && <ConfiguratorFieldGroupData childFields={childFields} />}
            </div>
        );
    },
);

const ConfiguratorFieldItem: FC<ConfiguratorItemProps> = memo(
    ({ fieldId, type, required, name, fieldKey }) => {
        const { onEdit, onDelete } = useConfiguratorFieldContext();

        const handleDelete = useCallback(() => {
            onDelete?.(fieldId);
        }, [onDelete, fieldId]);

        const handleEdit = useCallback(() => {
            onEdit?.(fieldId);
        }, [onEdit, fieldId]);

        return (
            <div className={styles.configuratorField} data-field-id={fieldId}>
                <ConfiguratorFieldDragHandle fieldId={fieldId} />
                <div className={styles.content}>
                    <ConfiguratorFieldTypeBadge type={type} />
                    <ConfiguratorFieldInfo name={name} fieldKey={fieldKey} required={required} />
                    <ConfiguratorFieldActions onEdit={handleEdit} onDelete={handleDelete} />
                </div>
            </div>
        );
    },
);
