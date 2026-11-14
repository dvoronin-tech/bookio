import type { FC, ReactNode } from 'react';
import { UiI18nProvider } from '@bookio/ui';
import { appLocale } from '#/i18n/locale';
import { buildUiCopy } from '#/i18n/uiCopy';

export const AppLocale: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <UiI18nProvider locale={appLocale()} copy={buildUiCopy()}>
            {children}
        </UiI18nProvider>
    );
};
