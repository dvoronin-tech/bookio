import { type FC, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@bookio/ui';
import {
    createBookingFormRouteApi,
    organizationRouteApi,
} from '#lib/routeApis';
import { m } from '../../../paraglide/messages.js';

type CreateBookingFormCloseButtonProps = {
    disabled?: boolean;
};

/** Leaves the create wizard for the forms list. Hidden while `?guided=true`. */
export const CreateBookingFormCloseButton: FC<
    CreateBookingFormCloseButtonProps
> = ({ disabled = false }) => {
    const navigate = useNavigate();
    const { guided } = createBookingFormRouteApi.useSearch();
    const { organizationId } = organizationRouteApi.useParams();

    const handleClose = useCallback(() => {
        void navigate({
            to: '/$organizationId/booking-forms',
            params: { organizationId },
        });
    }, [navigate, organizationId]);

    if (guided) return null;

    return (
        <Button
            type="button"
            variant="simple-clean"
            onClick={handleClose}
            disabled={disabled}
        >
            {m.close()}
        </Button>
    );
};
