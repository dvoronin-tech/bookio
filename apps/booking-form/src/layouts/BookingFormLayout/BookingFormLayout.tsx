import { type FC } from 'react';
import { BookingForm } from '@bookio/booking-form-ui';
import styles from './BookingFormLayout.module.scss';
import { useBookingFormData } from '#/store/BookingFormData/BookingFormDataContext';

export const BookingFormLayout: FC = () => {
    const bookingForm = useBookingFormData();

    return (
        <div className={styles.bookingFormLayout}>
            <BookingForm bookingForm={bookingForm} />
        </div>
    );
};
