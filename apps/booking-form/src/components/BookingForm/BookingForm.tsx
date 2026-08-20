import { useMemo, type FC } from 'react';
import { Button } from '@bookio/ui';
import { useBookingFormData } from '#/store/BookingFormData/BookingFormDataContext';
import styles from './BookingForm.module.scss';
import { isGroupField, type BookingFormField } from '#/components/Fields/field.types';
import { RenderField } from '#/components/Fields/FieldsMap';
import type { BookingFormBySlugsType } from '#/api/bookingForms/getBookingFormBySlugs';
import { useForm, type Control, type FieldValues, type UseFormRegister } from 'react-hook-form';

const DEFAULT_PHONE = '+375';

interface BookingFormProps {
    bookingForm: BookingFormBySlugsType;
}

export const BookingForm: FC<BookingFormProps> = ({ bookingForm }) => {
    const { fields, name, description } = bookingForm;

    const rootFields = useMemo(() => {
        return fields.filter((field) => field.parentId === null).sort((a, b) => a.order - b.order);
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

    const { register, control } = useForm({ defaultValues });

    return (
        <div className={styles.bookingForm}>
            <div className={styles.summary}>
                <h2 className={styles.title}>{name}</h2>
                {description && <p className={styles.hint}>{description}</p>}
            </div>

            <div className={styles.fields}>
                {rootFields.map((field) =>
                    isGroupField(field) ? (
                        <GroupField
                            key={field.id}
                            field={field}
                            register={register}
                            control={control}
                        />
                    ) : (
                        <RenderField
                            key={field.id}
                            field={field}
                            register={register}
                            control={control}
                        />
                    ),
                )}
            </div>

            <Button type="button" variant="primary-filled" className={styles.cta}>
                Submit booking
            </Button>
        </div>
    );
};

interface GroupFieldProps {
    register: UseFormRegister<FieldValues>;
    control: Control<FieldValues>;
    field: Extract<BookingFormField, { type: 'group' }>;
}

const GroupField: FC<GroupFieldProps> = ({ field, register, control }) => {
    const { fields } = useBookingFormData();

    const groupFields = useMemo(() => {
        return fields.filter((f) => f.parentId === field.id).sort((a, b) => a.order - b.order);
    }, [fields, field.id]);

    const groupHint = field.params.description;

    return (
        <div className={styles.groupField}>
            <div className={styles.groupHeader}>
                <span className={styles.groupAccent} aria-hidden />
                <div className={styles.groupTitles}>
                    <span className={styles.groupTitle}>{field.name}</span>
                    {groupHint && <span className={styles.groupHint}>{groupHint}</span>}
                </div>
            </div>
            {groupFields.map((child) => (
                <RenderField key={child.id} field={child} register={register} control={control} />
            ))}
        </div>
    );
};
