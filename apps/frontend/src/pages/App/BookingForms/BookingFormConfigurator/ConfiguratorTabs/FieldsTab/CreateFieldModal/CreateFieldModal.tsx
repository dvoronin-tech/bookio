import {
    memo,
    useCallback,
    useLayoutEffect,
    useMemo,
    type FC,
    type MouseEvent,
    type SubmitEvent,
} from 'react';
import styles from './CreateFieldModal.module.scss';
import { Dialog, Input } from '@bookio/ui';
import { ChoiceChip } from '#components/ChoiceChip/ChoiceChip';
import { RequiredRow } from '#components/RequiredRow/RequiredRow';
import { fieldTypeIcons } from '#components/ConfiguratorField/fieldTypeIcons';
import PlusIcon from '#assets/icons/plus.svg?react';

import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { useForm, useWatch, type FieldErrors } from 'react-hook-form';
import type { EntireBookingFormField } from '#api/bookingForms/getEntireBookingFormById';
import { useShallow } from 'zustand/shallow';

import { createModalFieldSchema, type CreateModalFieldInput } from '@bookio/backend/schemas';
import { ParamFields, type OptionItem } from '../ParamFields/ParamFields';

import { v7 as uuid7 } from 'uuid';
import toast from 'react-hot-toast';
import { flattenBookingFormFields, getNextSiblingFieldOrder } from '#utils/bookingFormFieldMappers';

const createEmptyOption = (): OptionItem => ({
    id: crypto.randomUUID(),
    value: '',
    label: '',
});

const getChoiceOptionsFromParams = (
    type: CreateModalFieldInput['type'] | undefined,
    params: CreateModalFieldInput['params'] | undefined,
) => {
    if ((type !== 'select' && type !== 'radio') || !params || !('options' in params)) {
        return [];
    }

    return params.options ?? [];
};

const getAcceptTypesFromParams = (
    type: CreateModalFieldInput['type'] | undefined,
    params: CreateModalFieldInput['params'] | undefined,
) => {
    if ((type !== 'file' && type !== 'image') || !params || !('accept' in params)) {
        return [];
    }

    return params.accept ?? [];
};

const normalizeFieldParams = (
    type: CreateModalFieldInput['type'] | undefined,
    params: CreateModalFieldInput['params'] | undefined,
) => {
    const choiceParamsOptions = getChoiceOptionsFromParams(type, params);

    if (choiceParamsOptions.length === 0) {
        return params;
    }

    return {
        ...params,
        options: choiceParamsOptions,
    };
};

interface CreateFieldModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bookingFormId: string;
    existingFields: EntireBookingFormField[];
}

export const CreateFieldModal: FC<CreateFieldModalProps> = memo(
    ({ open, onOpenChange, bookingFormId, existingFields }) => {
        const { setBookingFormFields, bookingFormFields } = useBookingFormConfiguratorStore(
            useShallow(({ setBookingFormFields, bookingFormFields }) => ({
                setBookingFormFields,
                bookingFormFields,
            })),
        );

        const { control, setValue, reset, register } = useForm<CreateModalFieldInput>({
            defaultValues: {},
        });

        const formData = useWatch({ control });

        const choiceOptions = useMemo((): OptionItem[] => {
            return getChoiceOptionsFromParams(formData.type, formData.params).map((option) => ({
                id: option.id,
                value: option.value,
                label: option.label,
            }));
        }, [formData.type, formData.params]);

        const selectedAcceptTypes = useMemo(
            () => getAcceptTypesFromParams(formData.type, formData.params),
            [formData.type, formData.params],
        );

        useLayoutEffect(() => {
            const options = getChoiceOptionsFromParams(formData.type, formData.params);
            if (options.length === 0 || options.every((option) => option.id)) return;

            setValue('params.options', options);
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

        const handleToggleAcceptType = useCallback(
            (acceptType: string) => {
                if (formData.type !== 'file' && formData.type !== 'image') return;

                const nextAccept = selectedAcceptTypes.includes(acceptType)
                    ? selectedAcceptTypes.filter((item) => item !== acceptType)
                    : [...selectedAcceptTypes, acceptType];

                setValue('params.accept', nextAccept.length > 0 ? nextAccept : undefined);
            },
            [formData.type, selectedAcceptTypes, setValue],
        );

        const handleCreate = useCallback(
            (event: SubmitEvent<HTMLFormElement>) => {
                event.preventDefault();

                const currentFields =
                    bookingFormFields?.fields ?? flattenBookingFormFields(existingFields);

                const result = createModalFieldSchema.safeParse({
                    ...formData,
                    id: uuid7(),
                    parentId: null,
                    order: getNextSiblingFieldOrder(currentFields, null),
                    required: formData.required ?? false,
                    params: normalizeFieldParams(formData.type, formData.params),
                });

                if (!result.success) {
                    result.error.issues.forEach((issue) => {
                        toast.error(issue.message, {
                            position: 'top-right',
                            duration: 4000
                        });
                    });
                    return;
                }

                setBookingFormFields({
                    bookingFormId,
                    fields: [...currentFields, result.data],
                });

                reset();
                onOpenChange(false);
            },
            [
                bookingFormFields,
                bookingFormId,
                existingFields,
                formData,
                onOpenChange,
                reset,
                setBookingFormFields,
            ],
        );

        return (
            <Dialog
                open={open}
                onOpenChange={handleCancel}
                closeOnEscape
                contentClassName={styles.content}
            >
                <div className={styles.header}>
                    <Dialog.Title>Create new field</Dialog.Title>
                    <Dialog.Description>
                        Configure a new field for your booking form
                    </Dialog.Description>
                </div>
                <form className={styles.form} onSubmit={handleCreate}>
                    <Input label="Label" {...register('name')} />

                    <Input label="Key" {...register('key')} />

                    <div className={styles.fieldTypesWrapper}>
                        <span className={styles.fieldTypesLabel}>Field type</span>
                        <div className={styles.fieldTypes}>
                            {(
                                Object.keys(fieldTypeIcons) as Array<EntireBookingFormField['type']>
                            ).map((typeOption) => {
                                const { icon: Icon, color } = fieldTypeIcons[typeOption];

                                const handleSelectFieldType = () => {
                                    setValue('type', typeOption);
                                    setValue('params', {});
                                };

                                return (
                                    <ChoiceChip
                                        key={typeOption}
                                        icon={<Icon color={color} />}
                                        onClick={handleSelectFieldType}
                                        active={typeOption === formData.type}
                                    >
                                        {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
                                    </ChoiceChip>
                                );
                            })}
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
                        selectedAcceptTypes={selectedAcceptTypes}
                        onAddOption={handleAddOption}
                        onRemoveOption={handleRemoveOption}
                        onUpdateOption={handleUpdateOption}
                        onToggleAcceptType={handleToggleAcceptType}
                    />

                    <Dialog.Actions className={styles.actions}>
                        <Dialog.Button variant="simple-clean" onClick={handleCancel}>
                            Cancel
                        </Dialog.Button>
                        <Dialog.Button
                            type="submit"
                            variant="primary-filled"
                            className={styles.createFieldButton}
                        >
                            <PlusIcon />
                            Create a new field
                        </Dialog.Button>
                    </Dialog.Actions>
                </form>
            </Dialog>
        );
    },
);
