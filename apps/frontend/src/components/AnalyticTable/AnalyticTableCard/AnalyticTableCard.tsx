import { AnalyticTable } from '#components/AnalyticTable/AnalyticTable/AnalyticTable.tsx';
import { AnalyticTablePagination } from '#components/AnalyticTable/AnalyticTablePagination/AnalyticTablePagination.tsx';
import styles from './AnalyticTableCard.module.scss';
import { type FC, useMemo } from 'react';
import { type ColumnDef, useTable } from '@tanstack/react-table';
import analyticTableFeatures, {
    type AnalyticTableFeatures,
} from '#components/AnalyticTable/utils/analyticTableFeatures.ts';

import type { BookingItem } from '#api/bookings/getOrganizationBookings.ts';
import clsx from 'clsx';

import {
    formatBookingDate,
    formatStatusText,
} from '#components/AnalyticTable/utils/format.ts';
import { getStatusClass } from '#components/AnalyticTable/utils/getStatusClass.ts';
import { BookingId } from '#components/AnalyticTable/components/BookingId.tsx';

interface AnalyticTableProps {
    data: BookingItem[];
}

export const AnalyticTableCard: FC<AnalyticTableProps> = ({ data }) => {
    const columns = useMemo<
        Array<ColumnDef<AnalyticTableFeatures, BookingItem>>
    >(
        () => [
            {
                accessorKey: 'id',
                header: 'Booking ID',
                cell: (info) => (
                    <BookingId bookingId={info.getValue<string>()} />
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: (info) => {
                    const status = info.getValue<string>();
                    return (
                        <span
                            className={clsx(
                                styles.statusBadge,
                                getStatusClass(status),
                            )}
                        >
                            <span className={styles.statusDot} />
                            {formatStatusText(status)}
                        </span>
                    );
                },
            },
            {
                id: 'bookingFormInfo',
                header: 'Form Info',
                cell: ({ row }) => {
                    const { name, slug } = row.original.bookingForm;
                    return `${name} | ${slug}`;
                },
            },
            {
                accessorKey: 'createdAt',
                header: 'Created At',
                cell: (info) => formatBookingDate(info.getValue<string>()),
            },

            {
                id: 'bookingData',
                header: 'Customer Details',
                cell: ({ row }) => {
                    const bookingData = row.original.data as Record<
                        string,
                        unknown
                    > | null;
                    if (!bookingData || typeof bookingData !== 'object') {
                        return (
                            <span className={styles.emptyData}>No details</span>
                        );
                    }

                    const entries = Object.entries(bookingData).filter(
                        ([, val]) =>
                            val !== undefined && val !== null && val !== '',
                    );

                    if (entries.length === 0) {
                        return (
                            <span className={styles.emptyData}>No details</span>
                        );
                    }

                    return (
                        <div className={styles.dataPreview}>
                            {entries.map(([key, value]) => (
                                <div
                                    key={key}
                                    className={styles.dataChip}
                                    title={`${key}: ${String(value)}`}
                                >
                                    <span className={styles.dataKey}>
                                        {key}:
                                    </span>
                                    <span className={styles.dataVal}>
                                        {String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    );
                },
            },
        ],
        [],
    );

    const table = useTable({
        features: analyticTableFeatures,
        columns,
        data,
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
