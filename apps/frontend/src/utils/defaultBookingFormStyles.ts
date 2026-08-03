export interface BookingFormStyles {
    primary: string;
    bgMain: string;
    bgSecondary: string;
    borderColor: string;
    textMain: string;
    textSecondary: string;
}

/** Mirrors brand tokens from apps/frontend/src/index.css (:root) */
export const DEFAULT_DARK_BOOKING_FORM_STYLES: BookingFormStyles = {
    primary: '#8510f2',
    bgMain: '#101010',
    bgSecondary: '#191918',
    borderColor: '#544d4d',
    textMain: '#ffffff',
    textSecondary: '#d9d2d2',
} as const;


export const DEFAULT_LIGHT_BOOKING_FORM_STYLES: BookingFormStyles = {
    primary: '#8510f2',
    bgMain: '#efeeec',
    bgSecondary: '#ddd9d6',
    borderColor: '#c5bfb9',
    textMain: '#2f2e2d',
    textSecondary: '#7a7472',
} as const;