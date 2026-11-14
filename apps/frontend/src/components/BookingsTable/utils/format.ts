import { format } from 'date-fns';
import { dateFnsLocale } from '#i18n/locale';
import { m } from '../../../paraglide/messages.js';

export const formatBookingDate = (
    dateStr: string | Date | null | undefined,
) => {
    return (
        dateStr &&
        format(new Date(dateStr), 'dd.MM.yyyy HH:mm', { locale: dateFnsLocale() })
    );
};

export const formatStatusText = (status: string) => {
    switch (status) {
        case 'cancelled_by_user':
            return m.status_cancelled_by_user();
        case 'cancelled_by_admin':
            return m.status_cancelled_by_admin();
        case 'pending':
            return m.status_pending();
        case 'confirmed':
            return m.status_confirmed();
        default:
            return status;
    }
};
