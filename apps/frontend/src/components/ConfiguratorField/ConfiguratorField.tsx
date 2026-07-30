import React, { useCallback, type FC, useRef, memo, useMemo } from 'react';
import type { EntireBookingFormField } from '#api/bookingForms/getEntireBookingFormById';

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
import type { UseDragAndDropReturn } from '#hooks/useDragAndDrop';

export interface ConfiguratorFieldProps {
    name: string;
    type: EntireBookingFormField['type'];
    fieldKey: string;
    required?: boolean;
    onEdit?: () => void;
    onDelete?: (fieldId: string) => void;
    fieldId: string;
    parentId: string | null;
    isRoot?: boolean;
    draggingProps?: UseDragAndDropReturn;
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
    draggingProps,
    fields,
    isRoot
}) => {
    const fieldRef = useRef<HTMLDivElement>(null);

    const handleDragStart = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);
            if (fieldRef.current !== null) {
                draggingProps?.onDragStart?.(fieldId, fieldRef, e.clientX, e.clientY, type);
            }
        },
        [draggingProps, fieldId, type],
    );

    const contextValue = useMemo<ConfiguratorFieldContextValue>(
        () => ({
            draggingProps,
            onEdit,
            onDelete,
            onDragStart: handleDragStart,
            fields,
        }),
        [draggingProps, onEdit, onDelete, fields, handleDragStart],
    );

    if (parentId !== null && isRoot) return null;

    return (
        <ConfiguratorFieldContext.Provider value={contextValue}>
            {type === 'group' ? (
                <ConfiguratorGroupItem
                    fieldId={fieldId}
                    fieldRef={fieldRef}
                    required={required}
                    name={name}
                    fieldKey={fieldKey}
                    type={type}
                    fields={fields}
                />
            ) : (
                <ConfiguratorFieldItem
                    fieldId={fieldId}
                    fieldRef={fieldRef}
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
    fields?: SyncBookingFormFieldItem[];
    fieldRef: React.RefObject<HTMLDivElement | null>;
    fieldId: string;
    name: string;
    fieldKey: string;
    type: EntireBookingFormField['type'];
    required?: boolean;
}

const ConfiguratorGroupItem: FC<ConfiguratorItemProps> = memo(
    ({ fieldRef, fieldId, type, required, name, fieldKey }) => {
        const { draggingProps, onEdit, fields, onDelete, onDragStart } =
            useConfiguratorFieldContext();

        const { draggingId, isDragging, draggingType, hoverTargetId } = draggingProps ?? {};

        const isDraggingNonGroupField = isDragging && draggingType !== 'group';

        const configuratorFieldClass = clsx(styles.configuratorField, styles.group, {
            [styles.groupWhileDragging]: isDraggingNonGroupField && draggingId !== fieldId,
            [styles.groupWhileDraggingHover]: isDraggingNonGroupField && hoverTargetId === fieldId,
        });

        const childFields = useMemo(() => {
            if (!fields) return [];
            return fields
                .filter((field) => field.parentId === fieldId)
                .sort((a, b) => a.order - b.order);
        }, [fields, fieldId]);

        const handleDelete = useCallback(() => {
            onDelete?.(fieldId);
        }, [onDelete, fieldId]);

        return (
            <div className={configuratorFieldClass} ref={fieldRef} data-field-id={fieldId}>
                <div className={styles.groupData}>
                    <ConfiguratorFieldDragHandle onPointerDown={onDragStart} />
                    <div className={styles.content}>
                        <ConfiguratorFieldTypeBadge type={type} />
                        <ConfiguratorFieldInfo
                            name={name}
                            fieldKey={fieldKey}
                            required={required}
                        />
                        <ConfiguratorFieldActions onEdit={onEdit} onDelete={handleDelete} />
                    </div>
                </div>
                {childFields.length > 0 && <ConfiguratorFieldGroupData childFields={childFields} />}
            </div>
        );
    },
);

const ConfiguratorFieldItem: FC<ConfiguratorItemProps> = memo(
    ({ fieldRef, fieldId, type, required, name, fieldKey }) => {
        const { onEdit, onDelete, onDragStart } = useConfiguratorFieldContext();

        const handleDelete = useCallback(() => {
            onDelete?.(fieldId);
        }, [onDelete, fieldId]);

        return (
            <div className={styles.configuratorField} ref={fieldRef} data-field-id={fieldId}>
                <ConfiguratorFieldDragHandle onPointerDown={onDragStart} />
                <div className={styles.content}>
                    <ConfiguratorFieldTypeBadge type={type} />
                    <ConfiguratorFieldInfo name={name} fieldKey={fieldKey} required={required} />
                    <ConfiguratorFieldActions onEdit={onEdit} onDelete={handleDelete} />
                </div>
            </div>
        );
    },
);
