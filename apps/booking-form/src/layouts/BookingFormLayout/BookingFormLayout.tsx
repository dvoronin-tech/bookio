import { type FC } from 'react';
import styles from './BookingFormLayout.module.scss';
import { BookingForm } from '#/components/BookingForm/BookingForm';
import { useBookingFormData } from '#/store/BookingFormData/BookingFormDataContext';

export const BookingFormLayout: FC = () => {
    const bookingForm = useBookingFormData();

    return (
        <div className={styles.bookingFormLayout}>
            <BookingForm bookingForm={bookingForm} />
        </div>
    );
};
