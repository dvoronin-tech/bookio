import styles from '#components/AnalyticTable/AnalyticTableCard/AnalyticTableCard.module.scss';

export const getStatusClass = (status: string) => {
    switch (status) {
        case 'confirmed':
            return styles.confirmed;
        case 'cancelled_by_user':
        case 'cancelled_by_admin':
            return styles.cancelled;
        case 'pending':
        default:
            return styles.pending;
    }
};
