import type { FC } from 'react';
import { GreetingLayout } from '#/layouts/GreetingLayout/GreetingLayout';
import type { BookingFormBySlugsType } from '#/api/bookingForms/getBookingFormBySlugs';

interface MainPageProps {
    bookingFormData: BookingFormBySlugsType;
}

export const MainPage: FC<MainPageProps> = ({ bookingFormData }) => {
    const { name, description } = bookingFormData;

    return <GreetingLayout name={name} description={description} />;
};
