import type { FC } from 'react';
import { StatusPage } from '#/pages/Errors/StatusPage/StatusPage';

export const InactiveBookingFormPage: FC = () => {
    return (
        <StatusPage
            code="Off"
            title="This booking form is currently inactive"
            description="This form exists, but it is not accepting new bookings right now. Please try again later or contact the organization if you need to make a reservation."
        />
    );
};
