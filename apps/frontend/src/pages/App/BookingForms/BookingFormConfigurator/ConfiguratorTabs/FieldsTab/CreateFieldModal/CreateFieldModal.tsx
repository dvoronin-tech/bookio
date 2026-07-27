import { memo, useCallback, useEffect, useLayoutEffect, useMemo, type FC, type MouseEvent } from 'react';
import styles from './CreateFieldModal.module.scss';
import { Dialog, Input } from '@bookio/ui';
import { ChoiceChip } from '#components/ChoiceChip/ChoiceChip';
import { RequiredRow } from '#components/RequiredRow/RequiredRow';
import { fieldTypeIcons } from '#components/ConfiguratorField/fieldTypeIcons';
import PlusIcon from '#assets/icons/plus.svg?react';

import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { useForm, useWatch } from 'react-hook-form';
import type { EntireBookingFormField } from '#api/bookingForms/getEntireBookingFormById';
import { useShallow } from 'zustand/shallow';

import {
    createModalFieldSchema,
    type CreateModalFieldInput,
} from '@bookio/backend/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { ParamFields, type OptionItem } from '../ParamFields/ParamFields';

const createEmptyOption = (): OptionItem => ({
    id: crypto.randomUUID(),
    value: '',
    label: '',
});

const ensureOptionIds = (
    options: Array<{ value?: string; label?: string; id?: string }>,
): OptionItem[] =>
    options.map((option) => ({
        id: option.id ?? crypto.randomUUID(),
        value: option.value ?? '',
        label: option.label ?? '',
    }));

const getChoiceOptionsFromParams = (
    type: CreateModalFieldInput['type'] | undefined,
    params: CreateModalFieldInput['params'] | undefined,
) => {
    if ((type !== 'select' && type !== 'radio') || !params || !('options' in params)) {
        return [];
    }

    return params.options ?? [];
};
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

    const choiceOptions = useMemo((): OptionItem[] => {
        return getChoiceOptionsFromParams(formData.type, formData.params).map((option) => ({
            id: (option as OptionItem).id,
            value: option.value ?? '',
            label: option.label ?? '',
        }));
    }, [formData.type, formData.params]);

    useLayoutEffect(() => {
        const options = getChoiceOptionsFromParams(formData.type, formData.params);
        if (options.length === 0 || options.every((option) => (option as OptionItem).id)) return;

        setValue('params.options', ensureOptionIds(options));
    }, [formData.type, formData.params, setValue]);

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
        [onOpenChange, reset],
    );

    const handleAddOption = useCallback(() => {
        if (formData.type !== 'select' && formData.type !== 'radio') return;

        setValue('params.options', [...choiceOptions, createEmptyOption()]);
    }, [choiceOptions, formData.type, setValue]);

    const handleRemoveOption = useCallback(
        (id: string) => {
            if (formData.type !== 'select' && formData.type !== 'radio') return;

            setValue(
                'params.options',
                choiceOptions.filter((option) => option.id !== id),
            );
        },
        [choiceOptions, formData.type, setValue],
    );

    const handleUpdateOption = useCallback(
        (id: string, field: 'value' | 'label', newValue: string) => {
            if (formData.type !== 'select' && formData.type !== 'radio') return;

            setValue(
                'params.options',
                choiceOptions.map((option) =>
                    option.id === id ? { ...option, [field]: newValue } : option,
                ),
            );
        },
        [choiceOptions, formData.type, setValue],
    );

    useEffect(() => {
        if (!open) {
            setCreateBookingFormField(null);
            return;
        }

        const choiceParamsOptions = getChoiceOptionsFromParams(formData.type, formData.params);
        const params =
            choiceParamsOptions.length > 0
                ? {
                      ...formData.params,
                      options: ensureOptionIds(choiceParamsOptions),
                  }
                : formData.params;

        setCreateBookingFormField({
            ...(formData.type ? { type: formData.type } : {}),
            required: formData.required ?? false,
            ...(formData.name !== undefined ? { name: formData.name } : {}),
            ...(formData.key !== undefined ? { key: formData.key } : {}),
            ...(params !== undefined ? { params } : {}),
        });
    }, [open, formData, setCreateBookingFormField]);

    return (
        <Dialog
            open={open}
            onOpenChange={handleCancel}
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
