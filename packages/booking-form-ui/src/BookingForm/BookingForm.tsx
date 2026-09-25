import {
    type AnimationEventHandler,
    memo,
    useMemo,
    useRef,
    useState,
} from 'react';
import { clsx } from 'clsx';
import { type FieldErrors, useForm } from 'react-hook-form';
import { Appear, getAppearDelayMs } from './components/Appear/Appear.js';
import { SubmitButton } from './components/SubmitButton/SubmitButton.js';
import styles from './BookingForm.module.scss';
import { BookingFormProvider } from './BookingFormContext.js';
import {
    type BookingFormField,
    type BookingFormFieldInput,
    isGroupField,
} from './fields/field.types.js';
import { RenderField } from './fields/FieldsMap.js';
import { normalizePhoneNumber } from './fields/components/PhoneInputField.js';
import { normalizeField } from './utils/normalizeField.js';

export type { BookingFormFieldInput } from './fields/field.types.js';

export type BookingFormData = {
    name: string;
    description: string | null;
    markRequiredFields: boolean;
    fields: BookingFormFieldInput[];
};

export type BookingFormProps = {
    bookingFormData: BookingFormData;
    /**
     * Function which calls when RHF validation passed successfully
     * @param data Received data from RHF
     * */
    onSubmit?: (data: Record<string, string>) => Promise<void>;
    /** Function which will call if RHF validation failed */
    onInvalid?: (errors: FieldErrors<Record<string, string>>) => void;
    /**
     * Called after `onSubmit` resolves and the form exit animation finishes.
     * With `prefers-reduced-motion: reduce`, or when `isPreview` is set,
     * it fires as soon as submit succeeds.
     * */
    onSuccess?: () => void;
    /**
     * Preview keeps the form on screen after a successful submit
     * and skips the exit animation.
     * */
    isPreview?: boolean;
};

export type FormState = 'idle' | 'loading' | 'error' | 'success';

function BookingForm({
    bookingFormData,
    onSubmit,
    onInvalid,
    onSuccess,
    isPreview = false,
}: BookingFormProps) {
    const [formState, setFormState] = useState<FormState>('idle');
    const formStateRef = useRef<FormState>(formState);

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

    const { register, control, handleSubmit } = useForm({
        mode: 'onChange',
    });

    const setProcessingState = (nextState: FormState) => {
        formStateRef.current = nextState;
        setFormState(nextState);
    };

    const onValidHandler = async (data: Record<string, string>) => {
        if (formStateRef.current === 'loading') {
            return;
        }

        try {
            setProcessingState('loading');
            const submittedData = { ...data };
            for (const field of fields) {
                if (field.type === 'phone') {
                    const value = data[field.key] ?? '';
                    submittedData[field.key] = value.trim()
                        ? (normalizePhoneNumber(value) ?? value)
                        : '';
                }
            }
            await onSubmit?.(submittedData);
            if (isPreview) {
                setProcessingState('idle');
                onSuccess?.();
                return;
            }
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                onSuccess?.();
                return;
            }
            setProcessingState('success');
        } catch {
            setProcessingState('error');
        }
    };

    const handleAnimationEnd: AnimationEventHandler<HTMLFormElement> = (e) => {
        if (e.target !== e.currentTarget) return;
        if (formStateRef.current !== 'success') return;
        onSuccess?.();
    };

    const onInvalidHandler = (errors: FieldErrors<Record<string, string>>) => {
        onInvalid?.(errors);
    };

    return (
        <BookingFormProvider
            register={register}
            control={control}
            markRequiredFields={markRequiredFields}
            formState={formState}
        >
            <form
                noValidate
                className={clsx(styles.bookingForm, {
                    [styles.success]: formState === 'success',
                })}
                onSubmit={handleSubmit(onValidHandler, onInvalidHandler)}
                onAnimationEnd={handleAnimationEnd}
            >
                <div className={styles.summary}>
                    <h2 className={styles.title}>{name}</h2>
                    {description && (
                        <p className={styles.hint}>{description}</p>
                    )}
                </div>

                <div className={styles.fields}>
                    {rootFields.map((field, index) => (
                        <Appear
                            key={field.id}
                            delayMs={getAppearDelayMs(index)}
                        >
                            {isGroupField(field) ? (
                                <GroupField field={field} fields={fields} />
                            ) : (
                                <RenderField field={field} />
                            )}
                        </Appear>
                    ))}
                </div>

                <Appear delayMs={getAppearDelayMs(rootFields.length)}>
                    <SubmitButton />
                </Appear>
            </form>
        </BookingFormProvider>
    );
}

interface GroupFieldProps {
    field: Extract<BookingFormField, { type: 'group' }>;
    fields: BookingFormFieldInput[];
}

function GroupField({ field, fields }: GroupFieldProps) {
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
                <RenderField key={child.id} field={child} />
            ))}
        </div>
    );
}

export default memo(BookingForm);
