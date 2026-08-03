import type { NavigateFunction } from 'react-router-dom';

/** → previous page in browser history */
export function navigateBack(navigate: NavigateFunction) {
    navigate(-1);
}
