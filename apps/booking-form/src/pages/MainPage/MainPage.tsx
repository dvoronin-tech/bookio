import { type CSSProperties, type FC, useMemo } from 'react';
import { BookingFormLayout } from '#/layouts/BookingFormLayout/BookingFormLayout';
import { Background } from '#/components/Background/Background';
import { useSteps } from '#/store/Steps/StepsContext';
import { GreetingLayout } from '#/layouts/GreetingLayout/GreetingLayout';
import { useBookingFormData } from '#/store/BookingFormData/BookingFormDataContext.tsx';

export const MainPage: FC = () => {
    const step = useSteps((s) => s.step);
    const { styles } = useBookingFormData();

    const formColors = useMemo(
        () => ({
            '--color-primary': styles.primary,
            '--color-bg-main': styles.bgMain,
            '--color-bg-ui': styles.bgSecondary,
            '--color-text-main': styles.textMain,
            '--color-text-secondary': styles.textSecondary,
            '--color-border': styles.borderColor,
        }),
        [styles],
    );

    return (
        <div style={formColors as CSSProperties}>
            {step === 'Greeting' && <GreetingLayout />}
            {step === 'BookingForm' && <BookingFormLayout />}
            <Background />
        </div>
    );
};
