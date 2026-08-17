import type { BookingFormBySlugsType } from "#/api/bookingForms/getBookingFormBySlugs";
import { createContext, useContext } from "react";

export const BookingFormDataContext = createContext<BookingFormBySlugsType | null>(null);

export const useBookingFormData = () => {
    const bookingFormData = useContext(BookingFormDataContext);
    
    if (!bookingFormData) {
        throw new Error('Booking form data not found');
    }
    return bookingFormData;
}