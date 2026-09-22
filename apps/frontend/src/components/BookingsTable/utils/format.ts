import { format } from 'date-fns';

export const formatBookingDate = (
    dateStr: string | Date | null | undefined,
) => {
    return dateStr && format(new Date(dateStr), 'dd.MM.yyyy HH:mm');
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
