import { memo, useCallback, type FC } from 'react';
import styles from './BookingFormCard.module.scss';
import type { BookingFormType } from '#api/bookingForms/getBookingForms';
import { Button, Dialog, Input } from '@bookio/ui';
import {
    useUpdateBookingForm,
    type UpdateBookingFormRequest,
} from '#api/bookingForms/updateBookingForm';
import toast from 'react-hot-toast';
import { useForm, type FieldErrors, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getFirstFieldError } from '#utils/formErrors';
import { ValidatableInput } from '#components/ValidatableInput/ValidatableInput';
import { useIsBookingFormExists } from '#api/bookingForms/isBookingFormExists';

const updateBookingFormSchema = z.object({
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(60),
    description: z.string().optional().nullable(),
}) satisfies z.ZodType<Omit<UpdateBookingFormRequest, 'bookingFormId' | 'isActive'>>;

type UpdateBookingFormFormData = z.infer<typeof updateBookingFormSchema>;

type EditBookingFormDialogProps = {
    bookingForm: BookingFormType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const EditBookingFormDialog: FC<EditBookingFormDialogProps> = memo(
    ({ bookingForm, open, onOpenChange }) => {
        const { mutateAsync: updateBookingForm } = useUpdateBookingForm(bookingForm.id);

        const { register, handleSubmit, control } = useForm<UpdateBookingFormFormData>({
            defaultValues: {
                name: bookingForm.name,
                slug: bookingForm.slug,
                description: bookingForm.description,
            },
            resolver: zodResolver(updateBookingFormSchema),
        });

        const name = useWatch({ control, name: 'name' });
        const slug = useWatch({ control, name: 'slug' });

        const { exists: nameExists } = useIsBookingFormExists({
            organizationId: bookingForm.organizationId,
            name: name.trim(),
        });
        const { exists: slugExists } = useIsBookingFormExists({
            organizationId: bookingForm.organizationId,
            slug: slug.trim(),
        });

        const nameIsValid =
            name.trim() === bookingForm.name.trim()
                ? undefined
                : nameExists === undefined
                  ? undefined
                  : !nameExists;
        const slugIsValid =
            slug.trim() === bookingForm.slug.trim()
                ? undefined
                : slugExists === undefined
                  ? undefined
                  : !slugExists;

        const onSubmit = useCallback(
            async (data: UpdateBookingFormFormData) => {
                const trimmedName = data.name.trim();
                const trimmedSlug = data.slug.trim();

                if (trimmedName !== bookingForm.name.trim() && nameExists === true) {
                    toast.error('Booking form with this name already exists');
                    return;
                }

                if (trimmedSlug !== bookingForm.slug.trim() && slugExists === true) {
                    toast.error('Booking form with this slug already exists');
                    return;
                }

                if (
                    trimmedName !== bookingForm.name.trim() ||
                    trimmedSlug !== bookingForm.slug.trim() ||
                    data.description?.trim() !== bookingForm.description?.trim()
                ) {
                    await toast.promise(
                        updateBookingForm({
                            bookingFormId: bookingForm.id,
                            name: trimmedName,
                            slug: trimmedSlug,
                            description: data.description?.trim() ?? null,
                        }),
                        {
                            loading: `Updating ${bookingForm.name}`,
                            success: `Updated ${bookingForm.name}`,
                            error: `Failed to update ${bookingForm.name}`,
                        },
                    );
                }

                onOpenChange(false);
            },
            [
                updateBookingForm,
                bookingForm.id,
                bookingForm.name,
                bookingForm.slug,
                bookingForm.description,
                nameExists,
                slugExists,
                onOpenChange,
            ],
        );

        const onInvalid = useCallback((errors: FieldErrors<UpdateBookingFormFormData>) => {
            toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
        }, []);

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                    <Dialog.Title>Edit Booking Form</Dialog.Title>
                    <form
                        onSubmit={handleSubmit(onSubmit, onInvalid)}
                        className={styles.editBookingFormForm}
                    >
                        <div className={styles.inputsGroup}>
                            <ValidatableInput
                                label="Name"
                                {...register('name')}
                                placeholder="Enter the name of the booking form"
                                isValid={nameIsValid}
                                errorMessage={
                                    nameExists === true
                                        ? 'Booking form with this name already exists'
                                        : undefined
                                }
                            />
                            <ValidatableInput
                                label="Slug"
                                {...register('slug')}
                                placeholder="Enter a unique slug for the booking form"
                                isValid={slugIsValid}
                                errorMessage={
                                    slugExists === true
                                        ? 'Booking form with this slug already exists'
                                        : undefined
                                }
                            />
                            <Input
                                label="Description"
                                {...register('description')}
                                type="textarea"
                                placeholder="Enter the description of the booking form"
                            />
                        </div>
                        <div className={styles.buttonsGroup}>
                            <Button variant="red-clean" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="green-clean">
                                Save
                            </Button>
                        </div>
                    </form>
            </Dialog>
        );
    },
);
