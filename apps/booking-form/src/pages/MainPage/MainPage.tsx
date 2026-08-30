import type { FC } from 'react';
import { BookingFormLayout } from '#/layouts/BookingFormLayout/BookingFormLayout';
import { Background } from '#/components/Background/Background';

export const MainPage: FC = () => {
    return (
        <>
            {/* <GreetingLayout />; */}
            <BookingFormLayout />
            <Background />
        </>
    );
};
