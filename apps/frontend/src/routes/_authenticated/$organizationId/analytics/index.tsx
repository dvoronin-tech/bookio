import { createFileRoute } from '@tanstack/react-router';
import { AnalyticsPage } from '#pages/Analytics/Analytics.tsx';

export const Route = createFileRoute('/_authenticated/$organizationId/analytics/')({
    component: AnalyticsPage,
});
