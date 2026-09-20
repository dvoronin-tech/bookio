import hono from '@lib/hono-client';
import type { InferRequestType } from 'hono/client';
import { trimObj } from '@utils/trimObj.ts';
import { validateError } from '@utils/validateError.ts';
import { useMutation } from '@tanstack/react-query';

const createClient = hono.booking.create;

type RequestBody = InferRequestType<typeof createClient.$post>['json'];

export const createBooking = async (body: RequestBody) => {
    const res = await createClient.$post({ json: trimObj(body) });

    if (res.ok) return

    const responseBody = await res.json();

    validateError(res, responseBody, 'Failed to create booking');
};

export const useCreateBooking = () => {
    return useMutation({
        mutationFn: createBooking,
        retry: 3,
        retryDelay: 500,
    });
};
