import hono from '#lib/hono-client';
import { useMutation } from '@tanstack/react-query';
import { validateError } from '#utils/validateError';
import type { InferRequestType } from 'hono/client';
import { invalidateBookingForm } from './getBookingForm';
import { invalidateBookingForms } from './getBookingForms';

const deleteBookingFormClient = hono['booking-forms']['delete'];

export type DeleteBookingFormRequest = InferRequestType<
    typeof deleteBookingFormClient.$delete
>['json'];

const deleteBookingFormRequest = async (
    requestData: DeleteBookingFormRequest,
) => {
    const response = await deleteBookingFormClient.$delete({
        json: requestData,
    });

    const body = await response.json();

    validateError(response, body, 'Failed to delete booking form');

    return body.data;
};

export const useDeleteBookingForm = (bookingFormId: string | undefined) => {
    return useMutation({
        mutationFn: deleteBookingFormRequest,
        onSuccess: () => {
            invalidateBookingForms();
            invalidateBookingForm(bookingFormId);
        },
    });
};
