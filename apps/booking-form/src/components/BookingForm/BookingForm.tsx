import { useMemo, type FC, type ReactNode } from 'react';
import { Button } from '@bookio/ui';
import { useBookingFormData } from '#/store/BookingFormData/BookingFormDataContext';
import styles from './BookingForm.module.scss';
import { isGroupField, type BookingFormField } from '#/components/Fields/field.types';
import { RenderField } from '#/components/Fields/FieldsMap';
import type { BookingFormBySlugsType } from '#/api/bookingForms/getBookingFormBySlugs';
import { useForm, type Control, type FieldValues, type UseFormRegister } from 'react-hook-form';

const DEFAULT_PHONE = '+375';
const FIELD_APPEAR_START_MS = 300;
const FIELD_APPEAR_STEP_MS = 100;

const getAppearDelayMs = (index: number) => FIELD_APPEAR_START_MS + index * FIELD_APPEAR_STEP_MS;

const Appear: FC<{ delayMs: number; children: ReactNode }> = ({ delayMs, children }) => (
    <div className={styles.appear} style={{ animationDelay: `${delayMs}ms` }}>
        {children}
    </div>
);

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
                {rootFields.map((field, index) => (
                    <Appear key={field.id} delayMs={getAppearDelayMs(index)}>
                        {isGroupField(field) ? (
                            <GroupField field={field} register={register} control={control} />
                        ) : (
                            <RenderField field={field} register={register} control={control} />
                        )}
                    </Appear>
                ))}
            </div>

            <Appear delayMs={getAppearDelayMs(rootFields.length)}>
                <Button type="button" variant="primary-filled" className={styles.cta}>
                    Submit booking
                </Button>
            </Appear>
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
