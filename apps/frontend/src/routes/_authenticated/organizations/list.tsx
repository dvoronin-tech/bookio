import { createFileRoute } from '@tanstack/react-router';
import { OrganizationList } from '#pages/Organization/OrganizationList/OrganizationList';
import { queryClient } from '#lib/query-client';

export const Route = createFileRoute('/_authenticated/organizations/list')({
    beforeLoad: () => {
        void queryClient.removeQueries({ queryKey: ['booking-forms'] });
    },
    component: OrganizationList,
});
