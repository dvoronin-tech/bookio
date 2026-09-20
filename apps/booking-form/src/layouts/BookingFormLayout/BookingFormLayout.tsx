import { type FC } from 'react';
import { BookingForm } from '@bookio/booking-form-ui';
import styles from './BookingFormLayout.module.scss';
import { useBookingFormData } from '#/store/BookingFormData/BookingFormDataContext';
import { useCreateBooking } from '@api/bookingForms/createBooking.ts';

export const BookingFormLayout: FC = () => {
    const bookingForm = useBookingFormData();
    const { mutateAsync } = useCreateBooking();

    const handleSubmit = async (data: Record<string, unknown>) => {
        await mutateAsync({
            bookingFormId: bookingForm.id,
            data,
        });
    };

    return (
        <div className={styles.bookingFormLayout}>
            <BookingForm
                bookingFormData={bookingForm}
                onSubmit={handleSubmit}
            />
        </div>
    );
};
