import { Hono } from 'hono';
import { createBookingHandler } from '@/handlers/booking/create.handler.js';
import {
    getBookingsById,
    getOrganizationBookings,
} from '@/handlers/booking/get.handler.js';

const bookingRoutes = new Hono()
    .post('/create', ...createBookingHandler)
    .get('/get-all', ...getOrganizationBookings)
    .get('/get-by-id', ...getBookingsById);

export default bookingRoutes;
