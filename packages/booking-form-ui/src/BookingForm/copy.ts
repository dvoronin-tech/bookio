export type BookingFormCopy = {
    submit: string;
    submitFailed: string;
    required: (name: string) => string;
    invalidEmail: string;
    invalidUrl: string;
    invalidPhone: string;
    fileTooLarge: (maxSizeMb: number) => string;
    imageTooLarge: (maxSizeMb: number) => string;
};

export const defaultBookingFormCopy: BookingFormCopy = {
    submit: 'Submit form',
    submitFailed: 'Failed to submit form',
    required: (name) => `${name} is required`,
    invalidEmail: 'Enter a valid email address',
    invalidUrl: 'Enter a valid URL',
    invalidPhone: 'Enter a valid phone number',
    fileTooLarge: (maxSizeMb) => `File must be ${maxSizeMb} MB or smaller`,
    imageTooLarge: (maxSizeMb) => `Image must be ${maxSizeMb} MB or smaller`,
};
