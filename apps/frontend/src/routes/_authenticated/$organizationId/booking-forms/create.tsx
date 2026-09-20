import { createFileRoute } from '@tanstack/react-router';
import { CreateBookingForm } from '#pages/BookingForms/CreateBookingForm/CreateBookingForm';

export const Route = createFileRoute('/_authenticated/$organizationId/booking-forms/create')({
    component: CreateBookingForm,
});
