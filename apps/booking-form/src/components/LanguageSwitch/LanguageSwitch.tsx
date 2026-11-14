import type { FC } from 'react';
import { SegmentedControl } from '@bookio/ui';
import FlagUsIcon from '#/assets/icons/flag-us.svg?react';
import FlagRuIcon from '#/assets/icons/flag-ru.svg?react';
import { getLocale, m, setLocale } from '#/i18n/messages';

export const LanguageSwitch: FC = () => {
    const locale = getLocale();

    return (
        <div className="fixed top-4 right-4 z-50">
            <SegmentedControl
                aria-label={m.language()}
                value={locale}
                onValueChange={setLocale}
            >
                <SegmentedControl.Item value="en" aria-label={m.language_en()}>
                    <FlagUsIcon width={20} height={14} />
                </SegmentedControl.Item>
                <SegmentedControl.Item value="ru" aria-label={m.language_ru()}>
                    <FlagRuIcon width={20} height={14} />
                </SegmentedControl.Item>
            </SegmentedControl>
        </div>
    );
};
