import type { NavigateFunction } from 'react-router-dom';

import { routes } from './routes';

/** → `/{organizationId}/booking-forms` or `/organizations/list` */
export function navigateToBookingForms(navigate: NavigateFunction, organizationId?: string) {
    if (organizationId) {
        navigate(routes.organizationBookingForms(organizationId));
    } else {
        navigate(routes.organizations.list);
    }
}
