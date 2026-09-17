import { useCallback, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import type { UpdateBookingFormStylesRequest } from '#api/bookingForms/bookingFormStyles/updateBookingFormStyles';
import type { ThemeVariant } from '#components/BookingFormStyles/ThemeCard/ThemeCard';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import {
    DEFAULT_DARK_BOOKING_FORM_STYLES,
    type BookingFormStyles,
} from '#utils/defaultBookingFormStyles';

import { THEMES } from '../bookingFormStyles.constants';

type UseBookingFormStylesParams = {
    bookingFormId: string;
};

const resolveColors = (
    bookingFormId: string,
    bookingFormStyles: UpdateBookingFormStylesRequest | null,
): BookingFormStyles => {
    if (bookingFormStyles?.bookingFormId !== bookingFormId) {
        return { ...DEFAULT_DARK_BOOKING_FORM_STYLES };
    }

    return {
        primary: bookingFormStyles.primary ?? DEFAULT_DARK_BOOKING_FORM_STYLES.primary,
        bgMain: bookingFormStyles.bgMain ?? DEFAULT_DARK_BOOKING_FORM_STYLES.bgMain,
        bgSecondary: bookingFormStyles.bgSecondary ?? DEFAULT_DARK_BOOKING_FORM_STYLES.bgSecondary,
        borderColor: bookingFormStyles.borderColor ?? DEFAULT_DARK_BOOKING_FORM_STYLES.borderColor,
        textMain: bookingFormStyles.textMain ?? DEFAULT_DARK_BOOKING_FORM_STYLES.textMain,
        textSecondary:
            bookingFormStyles.textSecondary ?? DEFAULT_DARK_BOOKING_FORM_STYLES.textSecondary,
    };
};

const isMatchingTheme = (colors: BookingFormStyles, themeColors: BookingFormStyles): boolean => {
    const keys = Object.keys(themeColors) as (keyof BookingFormStyles)[];
    return keys.every((key) => colors[key]?.toLowerCase() === themeColors[key]?.toLowerCase());
};

export const resolveThemeFromColors = (colors: BookingFormStyles): ThemeVariant => {
    for (const [theme, themeColors] of Object.entries(THEMES)) {
        if (isMatchingTheme(colors, themeColors)) {
            return theme as ThemeVariant;
        }
    }

    return 'custom';
};

export const useBookingFormStyles = ({ bookingFormId }: UseBookingFormStylesParams) => {
    const { bookingFormStyles, setBookingFormStyles } = useBookingFormConfiguratorStore(
        useShallow(({ bookingFormStyles, setBookingFormStyles }) => ({
            bookingFormStyles,
            setBookingFormStyles,
        })),
    );

    const colors = useMemo(
        () => resolveColors(bookingFormId, bookingFormStyles),
        [bookingFormId, bookingFormStyles],
    );
    const [theme, setTheme] = useState<ThemeVariant>(resolveThemeFromColors(colors));


    const handleThemeChange = useCallback(
        (variant: ThemeVariant) => {
            setTheme(variant);

            if (variant === 'custom') {
                return;
            }

            setBookingFormStyles({
                bookingFormId,
                ...THEMES[variant],
            });
        },
        [bookingFormId, setBookingFormStyles],
    );

    const handleColorChange = useCallback(
        (key: keyof BookingFormStyles) => (color: string) => {
            setTheme('custom');
            setBookingFormStyles({
                bookingFormId,
                ...colors,
                [key]: color,
            });
        },
        [bookingFormId, colors, setBookingFormStyles],
    );

    return {
        theme,
        colors,
        handleThemeChange,
        handleColorChange,
    };
};
