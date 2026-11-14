import type { ThemeVariant } from '#components/BookingFormStyles/ThemeCard/ThemeCard';
import {
    DEFAULT_DARK_BOOKING_FORM_STYLES,
    DEFAULT_LIGHT_BOOKING_FORM_STYLES,
    type BookingFormStyles,
} from '#utils/defaultBookingFormStyles';
import { m } from '../../paraglide/messages.js';

export const colorSections = () => [
    {
        heading: m.styles_accent(),
        fields: [{ key: 'primary' as const, label: m.color_primary() }],
    },
    {
        heading: m.styles_surfaces(),
        fields: [
            { key: 'bgMain' as const, label: m.styles_background() },
            { key: 'bgSecondary' as const, label: m.styles_surface() },
            { key: 'borderColor' as const, label: m.color_border() },
        ],
    },
    {
        heading: m.styles_text(),
        fields: [
            { key: 'textMain' as const, label: m.styles_primary_text() },
            { key: 'textSecondary' as const, label: m.styles_secondary_text() },
        ],
    },
];

export const THEMES: Record<Exclude<ThemeVariant, 'custom'>, BookingFormStyles> = {
    dark: DEFAULT_DARK_BOOKING_FORM_STYLES,
    light: DEFAULT_LIGHT_BOOKING_FORM_STYLES,
};
