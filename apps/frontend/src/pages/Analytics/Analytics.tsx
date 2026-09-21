import { type FC, useMemo } from 'react';
import { useGetOrganizationBookings } from '#api/bookings/getOrganizationBookings.ts';
import { organizationRouteApi } from '#lib/routeApis';
import { Button, PageLoader } from '@bookio/ui';
import styles from './Analytics.module.scss';
import { AnalyticTableCard } from '#components/AnalyticTable/AnalyticTableCard/AnalyticTableCard.tsx';

export const AnalyticsPage: FC = () => {
    const { organizationId } = organizationRouteApi.useParams();
    const {
        data: bookingsData,
        isPending,
        error,
        refetch,
    } = useGetOrganizationBookings(organizationId);

    const data = useMemo(() => bookingsData ?? [], [bookingsData]);

    if (isPending) {
        return <PageLoader />;
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <h2>Failed to load bookings</h2>
                <p>{error.message}</p>
                <Button
                    variant="primary-outlined"
                    onClick={() => void refetch()}
                >
                    Retry
                </Button>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={styles.analyticsPage}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h1>Bookings</h1>
                        <span className={styles.badge}>0</span>
                    </div>
                </div>
                <div className={styles.emptyContainer}>
                    <h2>No bookings yet</h2>
                    <p>
                        When customers submit your booking forms, their
                        appointments will appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.analyticsPage}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Bookings</h1>
                    <span className={styles.badge}>{data.length}</span>
                </div>
                <div className={styles.actionsSection}>
                    <Button
                        variant="primary-outlined"
                        onClick={() => void refetch()}
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            <AnalyticTableCard data={data} />
        </div>
    );
};
