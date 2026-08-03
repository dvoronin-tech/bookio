import type { NavigateFunction } from 'react-router-dom';

import { routes } from './routes';

/** → `/auth/sign-in` */
export function navigateToAuthSignIn(navigate: NavigateFunction) {
    navigate(routes.auth.signIn);
}
