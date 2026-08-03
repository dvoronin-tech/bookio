import type { NavigateFunction } from 'react-router-dom';

import { routes } from './routes';

/** → `/{organizationId}` */
export function navigateToOrganization(navigate: NavigateFunction, organizationId: string) {
    navigate(routes.organization(organizationId));
}
