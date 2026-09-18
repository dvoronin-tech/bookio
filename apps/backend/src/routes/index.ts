import { Hono } from 'hono';
import organizations from './organizations.routes.js';
import bookingsForms from './bookingForms.routes.js';
import fields from './fields.routes.js';
import metaData from './bookingFormMeta.routes.js';
import styles from './bookingFormStyles.routes.js';
import booking from './booking.routes.js'

import test from '@/handlers/test.js';

const routes = new Hono()
    .route('/organizations', organizations)
    .route('/booking-forms', bookingsForms)
    .route('/fields', fields)
    .route('/booking-form-meta', metaData)
    .route('/booking-form-styles', styles)
    .route('/booking', booking)
    .route('/test', test);

export default routes;
export type AppType = typeof routes;
