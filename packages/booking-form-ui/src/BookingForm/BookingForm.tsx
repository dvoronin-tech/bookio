import { memo, useMemo } from 'react';
import {
    type Control,
    type FieldErrors,
    type FieldValues,
    useForm,
    type UseFormRegister,
} from 'react-hook-form';
import { Button } from '@bookio/ui';
import { Appear, getAppearDelayMs } from './Appear.js';
import styles from './BookingForm.module.scss';
import {
    type BookingFormField,
    type BookingFormFieldInput,
    isGroupField,
} from './fields/field.types.js';
import { RenderField } from './fields/FieldsMap.js';
import { normalizeField } from './utils/normalizeField.js';

export type { BookingFormFieldInput } from './fields/field.types.js';

const DEFAULT_PHONE = '+375';

export type BookingFormData = {
    name: string;
    description: string | null;
    markRequiredFields: boolean;
    fields: BookingFormFieldInput[];
};

export type BookingFormProps = {
    bookingFormData: BookingFormData;
    onSubmit?: (data: Record<string, string>) => void;
    onInvalid?: (errors: FieldErrors<Record<string, string>>) => void;
};

function BookingForm({
    bookingFormData,
    onSubmit,
    onInvalid,
}: BookingFormProps) {
    const { name, description, markRequiredFields } = bookingFormData;

    const fields = useMemo(
        () => bookingFormData.fields.map(normalizeField),
        [bookingFormData.fields],
    );

    const rootFields = useMemo(() => {
        return fields
            .filter((field) => field.parentId === null)
            .sort((a, b) => a.order - b.order);
    }, [fields]);

    const defaultValues = useMemo(
        () =>
            Object.fromEntries(
                fields
                    .filter((field) => field.type === 'phone')
                    .map((field) => [field.key, DEFAULT_PHONE]),
            ),
        [fields],
    );

    const { register, control, handleSubmit } = useForm({ defaultValues });

    const onValidHandler = (data: Record<string, string>) => {
        onSubmit?.(data);
    };

    const onInvalidHandler = (errors: FieldErrors<Record<string, string>>) => {
        onInvalid?.(errors);
    };

    return (
        <form
            noValidate
            className={styles.bookingForm}
            onSubmit={handleSubmit(onValidHandler, onInvalidHandler)}
        >
            <div className={styles.summary}>
                <h2 className={styles.title}>{name}</h2>
                {description && <p className={styles.hint}>{description}</p>}
            </div>

            <div className={styles.fields}>
                {rootFields.map((field, index) => (
                    <Appear key={field.id} delayMs={getAppearDelayMs(index)}>
                        {isGroupField(field) ? (
                            <GroupField
                                field={field}
                                fields={fields}
                                register={register}
                                control={control}
                                markRequiredFields={markRequiredFields}
                            />
                        ) : (
                            <RenderField
                                field={field}
                                register={register}
                                control={control}
                                markRequiredFields={markRequiredFields}
                            />
                        )}
                    </Appear>
                ))}
            </div>

            <Appear delayMs={getAppearDelayMs(rootFields.length)}>
                <Button
                    type="submit"
                    variant="primary-filled"
                    className={styles.cta}
                >
                    Submit booking
                </Button>
            </Appear>
        </form>
    );
}

interface GroupFieldProps {
    register: UseFormRegister<FieldValues>;
    control: Control<FieldValues>;
    field: Extract<BookingFormField, { type: 'group' }>;
    fields: BookingFormFieldInput[];
    markRequiredFields: boolean;
}

function GroupField({
    field,
    fields,
    register,
    control,
    markRequiredFields,
}: GroupFieldProps) {
    const groupFields = useMemo(() => {
        return fields
            .filter((f) => f.parentId === field.id)
            .sort((a, b) => a.order - b.order);
    }, [fields, field.id]);

    const groupHint = field.params.description;

    return (
        <div className={styles.groupField}>
            <div className={styles.groupHeader}>
                <span className={styles.groupAccent} aria-hidden />
                <div className={styles.groupTitles}>
                    <span className={styles.groupTitle}>{field.name}</span>
                    {groupHint && (
                        <span className={styles.groupHint}>{groupHint}</span>
                    )}
                </div>
            </div>
            {groupFields.map((child) => (
                <RenderField
                    key={child.id}
                    field={child}
                    register={register}
                    control={control}
                    markRequiredFields={markRequiredFields}
                />
            ))}
        </div>
    );
}

export default memo(BookingForm);
