import type { ThemeVariant } from '#components/BookingFormStyles/ThemeCard/ThemeCard';
import {
    DEFAULT_DARK_BOOKING_FORM_STYLES,
    DEFAULT_LIGHT_BOOKING_FORM_STYLES,
    type BookingFormStyles,
} from '#utils/defaultBookingFormStyles';

export const COLOR_SECTIONS = [
    {
        heading: 'Accent',
        fields: [{ key: 'primary', label: 'Primary' }],
    },
    {
        heading: 'Surfaces',
        fields: [
            { key: 'bgMain', label: 'Background' },
            { key: 'bgSecondary', label: 'Surface' },
            { key: 'borderColor', label: 'Border' },
        ],
    },
    {
        heading: 'Text',
        fields: [
            { key: 'textMain', label: 'Primary text' },
            { key: 'textSecondary', label: 'Secondary text' },
        ],
    },
] as const;

export const THEMES: Record<Exclude<ThemeVariant, 'custom'>, BookingFormStyles> = {
    dark: DEFAULT_DARK_BOOKING_FORM_STYLES,
    light: DEFAULT_LIGHT_BOOKING_FORM_STYLES,
};
