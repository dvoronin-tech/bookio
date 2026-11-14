import { m } from '../../../paraglide/messages.js';

export const COLOR_KEYS = [
    'primary',
    'bgMain',
    'bgSecondary',
    'borderColor',
    'textMain',
    'textSecondary',
] as const;

export const colorLabel = (key: (typeof COLOR_KEYS)[number]) => {
    switch (key) {
        case 'primary':
            return m.color_primary();
        case 'bgMain':
            return m.color_bg_main();
        case 'bgSecondary':
            return m.color_bg_secondary();
        case 'borderColor':
            return m.color_border();
        case 'textMain':
            return m.color_text_main();
        case 'textSecondary':
            return m.color_text_secondary();
    }
};
