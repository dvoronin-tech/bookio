import type { NavigateFunction } from 'react-router-dom';

import { routes } from './routes';

/** → `/{organizationId}/booking-forms/{bookingFormId}/configurator` */
export function navigateToBookingFormConfigurator(
    navigate: NavigateFunction,
    organizationId: string,
    bookingFormId: string,
) {
    navigate(routes.bookingFormConfigurator(organizationId, bookingFormId));
}
