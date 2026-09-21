import { AnalyticTable } from '#components/AnalyticTable/AnalyticTable/AnalyticTable.tsx';
import { AnalyticTablePagination } from '#components/AnalyticTable/AnalyticTablePagination/AnalyticTablePagination.tsx';
import styles from './AnalyticTableCard.module.scss';
import { type FC, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { type ColumnDef, useTable } from '@tanstack/react-table';
import analyticTableFeatures, {
    type AnalyticTableFeatures,
} from '#components/AnalyticTable/utils/analyticTableFeatures.ts';

import type { BookingItem } from '#api/bookings/getOrganizationBookings.ts';
import CopyIcon from '#assets/icons/copy.svg?react';
import clsx from 'clsx';

import {
    formatBookingDate,
    formatStatusText,
} from '#components/AnalyticTable/utils/format.ts';
import { getStatusClass } from '#components/AnalyticTable/utils/getStatusClass.ts';

interface AnalyticTableProps {
    data: BookingItem[];
}

export const AnalyticTableCard: FC<AnalyticTableProps> = ({ data }) => {
    const handleCopy = useCallback((text: string, label: string) => {
        void navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    }, []);

    const columns = useMemo<
        Array<ColumnDef<AnalyticTableFeatures, BookingItem>>
    >(
        () => [
            {
                accessorKey: 'id',
                header: 'Booking ID',
                cell: (info) => {
                    const id = info.getValue<string>();
                    const shortId = id.length > 8 ? `${id.slice(0, 8)}...` : id;
                    return (
                        <div className={styles.idCell} title={id}>
                            <span>{shortId}</span>
                            <button
                                type="button"
                                className={styles.copyBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(id, 'Booking ID');
                                }}
                                title="Copy full ID"
                            >
                                <CopyIcon width={14} height={14} />
                            </button>
                        </div>
                    );
                },
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
                accessorKey: 'bookingFormId',
                header: 'Form ID',
                cell: (info) => {
                    const formId = info.getValue<string>();
                    const shortFormId =
                        formId.length > 8 ? `${formId.slice(0, 8)}...` : formId;
                    return (
                        <div className={styles.idCell} title={formId}>
                            <span>{shortFormId}</span>
                            <button
                                type="button"
                                className={styles.copyBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(formId, 'Form ID');
                                }}
                                title="Copy form ID"
                            >
                                <CopyIcon width={14} height={14} />
                            </button>
                        </div>
                    );
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
        [handleCopy],
    );

    const table = useTable({
        features: analyticTableFeatures,
        columns,
        data,
        initialState: {
            pagination: {
                pageSize: 10,
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
