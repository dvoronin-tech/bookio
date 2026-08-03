import type { NavigateFunction, NavigateOptions } from 'react-router-dom';

import { routes } from './routes';

/** → `/organizations/list` */
export function navigateToOrganizationsList(
    navigate: NavigateFunction,
    options?: NavigateOptions,
) {
    navigate(routes.organizations.list, options);
}
