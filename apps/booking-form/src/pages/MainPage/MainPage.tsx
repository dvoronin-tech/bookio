import type { FC } from 'react';
import { BookingFormLayout } from '#/layouts/BookingFormLayout/BookingFormLayout';
import { Background } from '#/components/Background/Background';
import { useSteps } from '#/store/Steps/StepsContext';
import { GreetingLayout } from '#/layouts/GreetingLayout/GreetingLayout';

export const MainPage: FC = () => {
    const step = useSteps((s) => s.step);

    return (
        <>
            <GreetingLayout />;
            <BookingFormLayout />
            <Background />
        </>
    );
};
