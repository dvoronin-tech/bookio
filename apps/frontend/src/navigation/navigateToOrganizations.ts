import type { NavigateFunction, NavigateOptions } from 'react-router-dom';

import { routes } from './routes';

/** → `/organizations` */
export function navigateToOrganizations(navigate: NavigateFunction, options?: NavigateOptions) {
    navigate(routes.organizations.index, options);
}
