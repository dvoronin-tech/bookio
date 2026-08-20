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

        const { register, handleSubmit, control, reset } = useForm<DeleteBookingFormFormData>({
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
                    toast.error('Booking form name does not match');
                    return;
                }

                await toast.promise(
                    deleteBookingForm({
                        bookingFormId: bookingForm.id,
                        name: data.name.trim(),
                        organizationPassword: data.organizationPassword,
                    }),
                    {
                        loading: `Deleting ${bookingForm.name}`,
                        success: `Deleted ${bookingForm.name}`,
                        error: `Failed to delete ${bookingForm.name}`,
                    },
                );

                onOpenChange(false);
            },
            [deleteBookingForm, bookingForm.id, bookingForm.name, onOpenChange],
        );

        const onInvalid = useCallback((errors: FieldErrors<DeleteBookingFormFormData>) => {
            toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
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
                <Dialog.Title>Delete Booking Form</Dialog.Title>
                <Dialog.Description>
                    Are you sure you want to delete this booking form?
                </Dialog.Description>
                <Dialog.Description>
                    If you really want to delete this booking form, please enter the booking form
                    name, your organization password, and click on the delete button.
                </Dialog.Description>
                <form
                    onSubmit={handleSubmit(onSubmit, onInvalid)}
                    className={styles.editBookingFormForm}
                >
                    <div className={styles.inputsGroup}>
                        <ValidatableInput
                            {...register('name')}
                            placeholder="Enter the name of the booking form"
                            isValid={isNameMatching}
                            errorMessage={
                                isNameMatching === false
                                    ? 'Booking form name does not match'
                                    : undefined
                            }
                        />
                        <ValidatableInput
                            {...register('organizationPassword')}
                            type="password"
                            placeholder="Enter organization password"
                        />
                    </div>
                    <div className={styles.buttonsGroup}>
                        <Button variant="simple-clean" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="red-clean" disabled={!canDelete}>
                            Delete
                        </Button>
                    </div>
                </form>
            </Dialog>
        );
    },
);
