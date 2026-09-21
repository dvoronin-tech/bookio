import { AnalyticTable } from '#components/AnalyticTable/AnalyticTable/AnalyticTable.tsx';
import { AnalyticTablePagination } from '#components/AnalyticTable/AnalyticTablePagination/AnalyticTablePagination.tsx';
import styles from './AnalyticTableCard.module.scss';
import { type FC, useMemo } from 'react';
import { createColumnHelper, useTable } from '@tanstack/react-table';
import analyticTableFeatures, {
    type AnalyticTableFeatures,
} from '#components/AnalyticTable/utils/analyticTableFeatures.ts';

import type { BookingItem } from '#api/bookings/getOrganizationBookings.ts';

import { formatBookingDate } from '#components/AnalyticTable/utils/format.ts';
import { BookingId } from '#components/AnalyticTable/components/BookingId.tsx';
import { BookingStatus } from '#components/AnalyticTable/components/BookingStatus.tsx';

interface AnalyticTableProps {
    data: BookingItem[];
}

export const AnalyticTableCard: FC<AnalyticTableProps> = ({ data }) => {
    const columnHelper = createColumnHelper<
        AnalyticTableFeatures,
        BookingItem
    >();

    const columns = useMemo(
        () =>
            columnHelper.columns([
                columnHelper.accessor('id', {
                    header: 'Booking ID',
                    size: 100,
                    minSize: 130,
                    cell: (info) => <BookingId bookingId={info.getValue()} />,
                }),
                columnHelper.accessor('status', {
                    header: 'Status',
                    size: 190,
                    cell: (info) => <BookingStatus status={info.getValue()} />,
                }),
                columnHelper.display({
                    id: 'bookingFormInfo',
                    header: 'Form Info',
                    maxSize: 150,
                    cell: ({ row }) => {
                        const { name, slug } = row.original.bookingForm;
                        return `${name} | ${slug}`;
                    },
                }),
                columnHelper.accessor('createdAt', {
                    header: 'Created At',
                    cell: (info) => formatBookingDate(info.getValue()),
                }),
            ]),
        [columnHelper],
    );

    const table = useTable({
        features: analyticTableFeatures,
        columns,
        data,
        defaultColumn: {
            minSize: 100,
            size: 150,
        },
        initialState: {
            pagination: {
                pageSize: 20,
                pageIndex: 0,
            },
        },
    });

    return (
        <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
                <AnalyticTable table={table} />
            </div>

            <AnalyticTablePagination table={table} />
        </div>
    );
};
