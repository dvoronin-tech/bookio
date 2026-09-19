import hono from '#lib/hono-client';
import { queryClient } from '#lib/query-client';
import { useMutation } from '@tanstack/react-query';
import { validateError } from '#utils/validateError';
import { trimObj } from '#utils/trimObj';
import type { InferRequestType } from 'hono/client';
import { type BookingFormsType } from './getBookingForms';
import { type BookingFormType, invalidateBookingForm } from './getBookingForm';

const updateBookingFormClient = hono['booking-forms']['update'];

export type UpdateBookingFormRequest = InferRequestType<
    typeof updateBookingFormClient.$put
>['json'];

const updateBookingFormRequest = async (
    requestData: UpdateBookingFormRequest,
) => {
    const response = await updateBookingFormClient.$put({
        json: trimObj(requestData),
    });

    const body = await response.json();

    validateError(response, body, 'Failed to update booking form');

    return body.data;
};

export const useUpdateBookingForm = (bookingFormId: string | undefined) => {
    return useMutation({
        mutationFn: updateBookingFormRequest,
        onSuccess: (updatedBookingForm) => {
            queryClient.setQueryData<BookingFormType>(
                ['booking-form', bookingFormId],
                (old) => (old ? { ...old, ...updatedBookingForm } : old),
            );
            invalidateBookingForm(bookingFormId);

            queryClient.setQueriesData<BookingFormsType>(
                { queryKey: ['booking-forms'] },
                (bookingForms: BookingFormsType | undefined) => {
                    if (!bookingForms) {
                        return bookingForms;
                    }

                    return bookingForms.map((bookingForm) =>
                        bookingForm.id === updatedBookingForm.id
                            ? { ...bookingForm, ...updatedBookingForm }
                            : bookingForm,
                    );
                },
            );
        },
    });
};
