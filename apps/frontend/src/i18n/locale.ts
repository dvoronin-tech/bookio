import { enUS, ru, type Locale } from 'date-fns/locale';
import { getLocale } from '#i18n/messages';

export type AppLocale = 'en' | 'ru';
export type PluralCategory = 'one' | 'few' | 'many';

export function appLocale(): AppLocale {
    return getLocale() === 'ru' ? 'ru' : 'en';
}

export function dateFnsLocale(): Locale {
    return appLocale() === 'ru' ? ru : enUS;
}

export function pluralCategory(count: number): PluralCategory {
    const n = Math.abs(count);
    if (appLocale() === 'en') {
        return n === 1 ? 'one' : 'many';
    }

    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'one';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'few';
    return 'many';
}

export function plural(
    count: number,
    forms: Record<PluralCategory, string>,
): string {
    return forms[pluralCategory(count)];
}
