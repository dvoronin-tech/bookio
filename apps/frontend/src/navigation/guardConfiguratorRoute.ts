import type { NavigateFunction } from 'react-router-dom';

import { routes } from './routes';

export type ConfiguratorRouteParams = {
    organizationId: string;
    bookingFormId: string;
};

/** On missing params → `/organizations/list` or `/{organizationId}/booking-forms` */
export function guardConfiguratorRoute(
    navigate: NavigateFunction,
    organizationId?: string,
    bookingFormId?: string,
): ConfiguratorRouteParams | null {
    if (!organizationId) {
        navigate(routes.organizations.list);
        return null;
    }

    if (!bookingFormId) {
        navigate(routes.organizationBookingForms(organizationId));
        return null;
    }

    return { organizationId, bookingFormId };
}
