import { format } from 'date-fns';

export const formatBookingDate = (
    dateStr: string | Date | null | undefined,
): string => {
    if (!dateStr) return '-';
    try {
        return format(new Date(dateStr), 'dd.MM.yyyy HH:mm');
    } catch {
        return String(dateStr);
    }
};

export const formatStatusText = (status: string) => {
    switch (status) {
        case 'cancelled_by_user':
            return 'Cancelled by user';
        case 'cancelled_by_admin':
            return 'Cancelled by admin';
        default:
            return status;
    }
};
