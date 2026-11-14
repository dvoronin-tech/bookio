import type { SyncBookingFormFieldItem } from '#utils/dataPreparers/bookingFormPreparers';
import { m } from '#i18n/messages';

export function fieldTypeLabel(type: SyncBookingFormFieldItem['type']): string {
    switch (type) {
        case 'text':
            return m.field_type_text();
        case 'textarea':
            return m.field_type_textarea();
        case 'email':
            return m.field_type_email();
        case 'phone':
            return m.field_type_phone();
        case 'url':
            return m.field_type_url();
        case 'number':
            return m.field_type_number();
        case 'select':
            return m.field_type_select();
        case 'checkbox':
            return m.field_type_checkbox();
        case 'radio':
            return m.field_type_radio();
        case 'date':
            return m.field_type_date();
        case 'time':
            return m.field_type_time();
        case 'file':
            return m.field_type_file();
        case 'image':
            return m.field_type_image();
        case 'group':
            return m.field_type_group();
    }
}
