import { useEffect, useState } from 'react';
import hono from '#lib/hono-client';
import { useDebounce } from 'use-debounce';
import type { InferRequestType, InferResponseType } from 'hono/client';
import { validateError } from '#utils/validateError';
import { toExistsIsValid } from '#utils/existsValidity';

const isExistsClient = hono['booking-forms']['is-exists'];

export type IsBookingFormExistsRequest = InferRequestType<typeof isExistsClient.$post>['json'];
export type IsBookingFormExistsResponse = InferResponseType<typeof isExistsClient.$post, 200>;

export const isBookingFormExists = async (requestData: IsBookingFormExistsRequest) => {
    const response = await isExistsClient.$post({
        json: requestData,
    });

    const body = await response.json();

    validateError(response, body, 'Failed to check if booking form exists');

    return body.data;
};

const CHECK_DEBOUNCE_MS = 500;

type UseIsBookingFormExistsParams = {
    organizationId: string;
    name?: string;
    slug?: string;
    unchangedValue?: string;
};

export const useIsBookingFormExists = ({
    organizationId,
    name,
    slug,
    unchangedValue,
}: UseIsBookingFormExistsParams) => {
    const value = name ?? slug ?? '';
    const field = name !== undefined ? 'name' : 'slug';

    const [debouncedValue] = useDebounce(value, CHECK_DEBOUNCE_MS);
    const isValueSettled = value === debouncedValue;

    const [checkResult, setCheckResult] = useState<{
        field: 'name' | 'slug';
        value: string;
        organizationId: string;
        exists: boolean;
    } | null>(null);

    useEffect(() => {
        if (!isValueSettled || !debouncedValue || !organizationId) {
            return;
        }

        let cancelled = false;

        const requestData: IsBookingFormExistsRequest =
            field === 'name'
                ? { name: debouncedValue, organizationId }
                : { slug: debouncedValue, organizationId };

        isBookingFormExists(requestData).then((exists) => {
            if (!cancelled) {
                setCheckResult({
                    field,
                    value: debouncedValue,
                    organizationId,
                    exists,
                });
            }
        });

        return () => {
            cancelled = true;
        };
    }, [debouncedValue, field, isValueSettled, organizationId]);

    const exists =
        isValueSettled &&
        debouncedValue.length > 0 &&
        organizationId.length > 0 &&
        checkResult?.field === field &&
        checkResult?.value === debouncedValue &&
        checkResult?.organizationId === organizationId
            ? checkResult.exists
            : undefined;

    const isValid = toExistsIsValid(exists, { currentValue: value, unchangedValue });

    return { isValid };
};
