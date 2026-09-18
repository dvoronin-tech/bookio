import { Hono } from 'hono';
import { createBookingHandler } from '@/handlers/booking/create.handler.js';

const bookingRoutes = new Hono().post('/create', ...createBookingHandler);

export default bookingRoutes;
