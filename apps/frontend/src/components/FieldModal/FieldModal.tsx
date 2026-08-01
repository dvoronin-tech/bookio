import { memo, useCallback, type FC, type MouseEvent } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { Dialog } from '@bookio/ui';
import { FieldBasicFields } from './FieldBasicFields';
import { FieldModalActions } from './FieldModalActions';
import { FieldModalHeader } from './FieldModalHeader';
import { FieldRequiredToggle } from './FieldRequiredToggle';
import { FieldTypeSelector } from './FieldTypeSelector';
import { useFieldModalForm } from './hooks/useFieldModalForm';
import { useFieldModalSubmit } from './hooks/useFieldModalSubmit';
import { ParamFields } from './ParamFields/ParamFields';
import styles from './FieldModal.module.scss';

interface FieldModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bookingFormId: string;
    fieldId?: string | null;
}

export const FieldModal: FC<FieldModalProps> = memo(
    ({ open, onOpenChange, bookingFormId, fieldId }) => {
        const isEditMode = Boolean(fieldId);

        const methods = useFieldModalForm({
            open,
            fieldId,
            onOpenChange,
        });

        const { reset, handleSubmit, control } = methods;

        const handleSuccess = useCallback(() => {
            reset();
            onOpenChange(false);
        }, [reset, onOpenChange]);

        const onSave = useFieldModalSubmit({
            fieldId,
            bookingFormId,
            onSuccess: handleSuccess,
        });

        const type = useWatch({ control, name: 'type' });

        const handleCancel = useCallback(
            (value: boolean | MouseEvent<HTMLButtonElement>) => {
                if (typeof value === 'boolean') {
                    onOpenChange(value);
                } else {
                    value.preventDefault();
                    value.stopPropagation();
                    onOpenChange(false);
                }
                reset();
            },
            [reset, onOpenChange],
        );

        return (
            <Dialog
                open={open}
                onOpenChange={handleCancel}
                closeOnEscape
                contentClassName={styles.content}
            >
                <FieldModalHeader isEditMode={isEditMode} />
                <FormProvider {...methods}>
                    <form
                        className={styles.form}
                        onSubmit={handleSubmit(onSave)}
                    >
                        <FieldBasicFields />
                        <FieldTypeSelector />
                        {type && type !== 'group' && <FieldRequiredToggle />}
                        <ParamFields />
                        <FieldModalActions isEditMode={isEditMode} onCancel={handleCancel} />
                    </form>
                </FormProvider>
            </Dialog>
        );
    },
);
