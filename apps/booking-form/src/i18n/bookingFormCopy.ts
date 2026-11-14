import type { BookingFormCopy } from '@bookio/booking-form-ui';
import { m } from '../paraglide/messages.js';

export function buildBookingFormCopy(): BookingFormCopy {
    return {
        submit: m.form_submit(),
        submitFailed: m.form_submit_failed(),
        required: (name) => m.form_required({ name }),
        invalidEmail: m.form_invalid_email(),
        invalidUrl: m.form_invalid_url(),
        invalidPhone: m.form_invalid_phone(),
        fileTooLarge: (maxSizeMb) => m.form_file_too_large({ maxSizeMb }),
        imageTooLarge: (maxSizeMb) => m.form_image_too_large({ maxSizeMb }),
    };
}
