import { Hono } from 'hono';
import { createBookingHandler } from '@/handlers/booking/create.handler.js';
import { getBookingsById } from '@/handlers/booking/get.handler.js';

const bookingRoutes = new Hono()
    .post('/create', ...createBookingHandler)
    .get('/get-by-id', ...getBookingsById);

export default bookingRoutes;
