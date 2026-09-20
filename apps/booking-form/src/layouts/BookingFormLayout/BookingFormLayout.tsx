import { type FC } from 'react';
import { BookingForm } from '@bookio/booking-form-ui';
import styles from './BookingFormLayout.module.scss';
import { useBookingFormData } from '#/store/BookingFormData/BookingFormDataContext';
import { useSteps } from '#/store/Steps/StepsContext';
import { stepsManager } from '#/store/Steps/stepsManager';
import { useCreateBooking } from '@api/bookingForms/createBooking.ts';

export const BookingFormLayout: FC = () => {
    const bookingForm = useBookingFormData();
    const setStep = useSteps((s) => s.setStep);
    const { mutateAsync } = useCreateBooking();

    const handleSubmit = async (data: Record<string, unknown>) => {
        await mutateAsync({
            bookingFormId: bookingForm.id,
            data,
        });
    };

    const handleSuccess = () => {
        const next = stepsManager.BookingForm.next;
        if (!next) return;
        setStep(next());
    };

    return (
        <div className={styles.bookingFormLayout}>
            <BookingForm
                bookingFormData={bookingForm}
                onSubmit={handleSubmit}
                onSuccess={handleSuccess}
            />
        </div>
    );
};
