import { Hono } from 'hono';
import { syncBookingFormFieldsHandler } from '@/handlers/bookingFormFields/sync.handler.js';

const fields = new Hono().put('/sync', ...syncBookingFormFieldsHandler);

export default fields;
