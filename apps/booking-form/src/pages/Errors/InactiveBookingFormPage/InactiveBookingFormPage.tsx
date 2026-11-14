import type { FC } from 'react';
import { StatusPage } from '#/pages/Errors/StatusPage/StatusPage';
import { m } from '../../../paraglide/messages.js';

export const InactiveBookingFormPage: FC = () => {
    return (
        <StatusPage
            code={m.inactive_code()}
            title={m.inactive_title()}
            description={m.inactive_description()}
        />
    );
};
