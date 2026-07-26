import { memo, useCallback, useEffect, useMemo, type FC } from 'react';
import styles from './CreateFieldModal.module.scss';
import { Dialog, Input } from '@bookio/ui';
import { ChoiceChip } from '@components/ChoiceChip/ChoiceChip';
import { RequiredRow } from '@components/RequiredRow/RequiredRow';
import { fieldTypeIcons } from '@components/ConfiguratorField/fieldTypeIcons';
import PlusIcon from '@assets/icons/plus.svg?react';

import { useBookingFormConfiguratorStore } from '@store/useBookingFormConfiguratorStore';
import { useForm, useWatch } from 'react-hook-form';
import type { EntireBookingFormField } from '@api/bookingForms/getEntireBookingFormById';
import { useShallow } from 'zustand/shallow';

import {
    createModalFieldSchema,
    type CreateModalFieldInput,
} from '@schemas/FieldModal/CreateModalField.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ParamFields } from '../ParamFields/ParamFields';
interface CreateFieldModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CreateFieldModal: FC<CreateFieldModalProps> = memo(({ open, onOpenChange }) => {
    const { setCreateBookingFormField } = useBookingFormConfiguratorStore(
        useShallow(({ setCreateBookingFormField }) => ({
            setCreateBookingFormField,
        })),
    );

    const { control, setValue, reset, register } = useForm<CreateModalFieldInput>({
        defaultValues: {},
        resolver: zodResolver(createModalFieldSchema),
    });

    const formData = useWatch({ control });

    const choiceOptions = useMemo(
        () =>
            formData.type === 'select' || formData.type === 'radio'
                ? (formData.params?.options ?? []).map((option) => ({
                      value: option.value ?? '',
                      label: option.label ?? '',
                  }))
                : [],
        [formData.type, formData.params],
    );

    const handleCancel = useCallback(() => {
        onOpenChange(false);
    }, [onOpenChange]);

    const handleAddOption = useCallback(() => {
        if (formData.type !== 'select' && formData.type !== 'radio') return;

        setValue('params.options', [
            ...choiceOptions,
            { value: '', label: '' },
        ]);
    }, [choiceOptions, formData.type, setValue]);

    const handleRemoveOption = useCallback(
        (index: number) => {
            if (formData.type !== 'select' && formData.type !== 'radio') return;

            setValue(
                'params.options',
                choiceOptions.filter((_, optionIndex) => optionIndex !== index),
            );
        },
        [choiceOptions, formData.type, setValue],
    );

    const handleUpdateOption = useCallback(
        (index: number, field: 'value' | 'label', newValue: string) => {
            if (formData.type !== 'select' && formData.type !== 'radio') return;

            setValue(
                'params.options',
                choiceOptions.map((option, optionIndex) =>
                    optionIndex === index ? { ...option, [field]: newValue } : option,
                ),
            );
        },
        [choiceOptions, formData.type, setValue],
    );

    useEffect(() => {
        if (!open) {
            reset({});
            setCreateBookingFormField(null);
            return;
        }

        setCreateBookingFormField({
            ...(formData.type ? { type: formData.type } : {}),
            required: formData.required ?? false,
            ...(formData.name !== undefined ? { name: formData.name } : {}),
            ...(formData.key !== undefined ? { key: formData.key } : {}),
            ...(formData.params !== undefined ? { params: formData.params } : {}),
        });
    }, [open, formData, reset, setCreateBookingFormField]);

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            closeOnEscape
            contentClassName={styles.content}
        >
            <div className={styles.header}>
                <Dialog.Title>Create new field</Dialog.Title>
                <Dialog.Description>Configure a new field for your booking form</Dialog.Description>
            </div>
            <form className={styles.form}>
                <Input label="Label" {...register('name')} />

                <Input label="Key" {...register('key')} />

                <div className={styles.fieldTypesWrapper}>
                    <span className={styles.fieldTypesLabel}>Field type</span>
                    <div className={styles.fieldTypes}>
                        {(Object.keys(fieldTypeIcons) as Array<EntireBookingFormField['type']>).map(
                            (typeOption) => {
                                const { icon: Icon, color } = fieldTypeIcons[typeOption];

                                const handleCreateField = () => {
                                    setValue('type', typeOption);
                                    setValue('params', {});
                                };

                                return (
                                    <ChoiceChip
                                        key={typeOption}
                                        icon={<Icon color={color} />}
                                        onClick={handleCreateField}
                                        active={typeOption === formData.type}
                                    >
                                        {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
                                    </ChoiceChip>
                                );
                            },
                        )}
                    </div>
                </div>

                {formData.type && formData.type !== 'group' && (
                    <RequiredRow
                        checked={formData.required ?? false}
                        onCheckedChange={(value) => setValue('required', value)}
                    />
                )}

                <ParamFields
                    type={formData.type}
                    options={choiceOptions}
                    onAddOption={handleAddOption}
                    onRemoveOption={handleRemoveOption}
                    onUpdateOption={handleUpdateOption}
                />
            </form>
            <Dialog.Actions className={styles.actions}>
                <Dialog.Button variant="simple-clean" onClick={handleCancel}>
                    Cancel
                </Dialog.Button>
                <Dialog.Button variant="primary-filled" className={styles.createFieldButton}>
                    <PlusIcon />
                    Create a new field
                </Dialog.Button>
            </Dialog.Actions>
        </Dialog>
    );
});

