import { getLocale } from '#/i18n/messages';

export type AppLocale = 'en' | 'ru';

export function appLocale(): AppLocale {
    return getLocale() === 'ru' ? 'ru' : 'en';
}
