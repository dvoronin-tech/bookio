import { createContext, type FC, type ReactNode, useContext } from 'react';
import type { Control, FieldValues, UseFormRegister } from 'react-hook-form';
import type { FormState } from './BookingForm.js';

export type BookingFormContextValue = {
    register: UseFormRegister<FieldValues>;
    control: Control<FieldValues>;
    markRequiredFields: boolean;
    formState: FormState;
};

const BookingFormContext = createContext<BookingFormContextValue | null>(null);

export const useBookingFormContext = () => {
    const context = useContext(BookingFormContext);

    if (!context) {
        throw new Error(
            'useBookingFormContext must be used within a BookingFormProvider',
        );
    }

    return context;
};

export const BookingFormProvider: FC<
    BookingFormContextValue & { children: ReactNode }
> = ({ children, ...contextData }) => {
    return (
        <BookingFormContext.Provider value={contextData}>
            {children}
        </BookingFormContext.Provider>
    );
};
