import { getLocale } from '../paraglide/runtime.js';

export type AppLocale = 'en' | 'ru';

export function appLocale(): AppLocale {
    return getLocale() === 'ru' ? 'ru' : 'en';
}
