import { memo, useCallback, useEffect, type FC } from 'react';
import styles from './BookingFormCard.module.scss';
import type { BookingFormType } from '#api/bookingForms/getBookingForms';
import { Button, Dialog, ValidatableInput } from '@bookio/ui';
import {
    useDeleteBookingForm,
    type DeleteBookingFormRequest,
} from '#api/bookingForms/deleteBookingForm';
import toast from 'react-hot-toast';
import { useForm, type FieldErrors, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getFirstFieldError } from '#utils/formErrors';
import { useDebounce } from 'use-debounce';
import { m } from '#i18n/messages';
import { applyValidationIssues } from '#i18n/apiError';

const deleteBookingFormSchema = z.object({
    name: z.string().min(1).max(255),
    organizationPassword: z.string().min(1),
}) satisfies z.ZodType<Omit<DeleteBookingFormRequest, 'bookingFormId'>>;

type DeleteBookingFormFormData = z.infer<typeof deleteBookingFormSchema>;

type DeleteBookingFormDialogProps = {
    bookingForm: BookingFormType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const DeleteBookingFormDialog: FC<DeleteBookingFormDialogProps> = memo(
    ({ bookingForm, open, onOpenChange }) => {
        const { mutateAsync: deleteBookingForm } = useDeleteBookingForm(bookingForm.id);

        const { register, handleSubmit, control, reset, setError } = useForm<DeleteBookingFormFormData>({
            defaultValues: {
                name: '',
                organizationPassword: '',
            },
            resolver: zodResolver(deleteBookingFormSchema),
        });

        useEffect(() => {
            if (open) {
                reset({ name: '', organizationPassword: '' });
            }
        }, [open, reset]);

        const onSubmit = useCallback(
            async (data: DeleteBookingFormFormData) => {
                if (data.name.trim() !== bookingForm.name.trim()) {
                    toast.error(m.forms_delete_name_mismatch());
                    return;
                }

                await toast.promise(
                    deleteBookingForm({
                        bookingFormId: bookingForm.id,
                        name: data.name.trim(),
                        organizationPassword: data.organizationPassword,
                    }),
                    {
                        loading: m.forms_deleting({ name: bookingForm.name }),
                        success: m.forms_deleted({ name: bookingForm.name }),
                        error: (error: Error) => {
                            applyValidationIssues(
                                error,
                                setError as (
                                    name: string,
                                    error: { type: string; message: string },
                                ) => void,
                            );
                            return error instanceof Error
                                ? error.message
                                : m.forms_delete_failed({ name: bookingForm.name });
                        },
                    },
                );

                onOpenChange(false);
            },
            [deleteBookingForm, bookingForm.id, bookingForm.name, onOpenChange, setError],
        );

        const onInvalid = useCallback((errors: FieldErrors<DeleteBookingFormFormData>) => {
            toast.error(getFirstFieldError(errors) ?? m.invalid_form_data());
        }, []);

        const name = useWatch({ control, name: 'name' });
        const organizationPassword = useWatch({ control, name: 'organizationPassword' });
        const [debouncedName] = useDebounce(name ?? '', 500);
        const isNameSettled = name === debouncedName;

        const isNameMatching =
            !debouncedName || !isNameSettled
                ? undefined
                : debouncedName.trim() === bookingForm.name.trim();

        const canDelete =
            isNameSettled &&
            debouncedName.trim() === bookingForm.name.trim() &&
            organizationPassword.trim().length > 0;

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <Dialog.Title>{m.forms_delete_title()}</Dialog.Title>
                <Dialog.Description>
                    {m.forms_delete_question()}
                </Dialog.Description>
                <Dialog.Description>
                    {m.forms_delete_instructions()}
                </Dialog.Description>
                <form
                    onSubmit={handleSubmit(onSubmit, onInvalid)}
                    className={styles.editBookingFormForm}
                >
                    <div className={styles.inputsGroup}>
                        <ValidatableInput
                            {...register('name')}
                            placeholder={m.forms_delete_name_placeholder()}
                            isValid={isNameMatching}
                            errorMessage={
                                isNameMatching === false
                                    ? m.forms_delete_name_mismatch()
                                    : undefined
                            }
                        />
                        <ValidatableInput
                            {...register('organizationPassword')}
                            type="password"
                            placeholder={m.org_password_confirm_placeholder()}
                        />
                    </div>
                    <div className={styles.buttonsGroup}>
                        <Button variant="simple-clean" onClick={() => onOpenChange(false)}>
                            {m.cancel()}
                        </Button>
                        <Button type="submit" variant="red-clean" disabled={!canDelete}>
                            {m.delete()}
                        </Button>
                    </div>
                </form>
            </Dialog>
        );
    },
);
