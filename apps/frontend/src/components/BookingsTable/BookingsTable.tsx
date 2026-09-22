import { type FC, useMemo } from 'react';
import styles from './BookingsTable.module.scss';
import { createColumnHelper, useTable } from '@tanstack/react-table';
import bookingsTableFeatures, {
    type BookingsTableFeatures,
} from '#components/BookingsTable/bookingsTableFeatures.ts';
import type { BookingItem } from '#api/bookings/getOrganizationBookings.ts';
import { BookingId } from '#components/AnalyticTable/components/BookingId.tsx';
import {
    formatBookingDate,
    formatDataValue,
} from '#components/BookingsTable/utils/format.tsx';
import { getDataKeys } from '#components/BookingsTable/utils/getDataKeys.ts';
import { readBookingDataValue } from '#components/BookingsTable/utils/readBookingDataValue.ts';
import { BookingStatus } from '#components/AnalyticTable/components/BookingStatus.tsx';
import { THead } from '#components/BookingsTable/THead/THead.tsx';
import { TBody } from '#components/BookingsTable/TBody/TBody.tsx';
import { BookingsTablePagination } from '#components/BookingsTable/BookingsTablePagination/BookingsTablePagination.tsx';

interface BookingsTableProps {
    data: BookingItem[];
}

export const BookingsTable: FC<BookingsTableProps> = ({ data }) => {
    const createColumn = createColumnHelper<
        BookingsTableFeatures,
        BookingItem
    >();

    const bookingDataColumns = useMemo(() => {
        const keys = getDataKeys(data);

        return keys.map((key) =>
            createColumn.accessor(
                (row) => readBookingDataValue(row.data, key),
                {
                    id: `data.${key}`,
                    header: key,
                    cell: ({ getValue }) => formatDataValue(getValue()),
                },
            ),
        );
    }, [createColumn, data]);

    const columns = useMemo(
        () =>
            createColumn.columns([
                createColumn.accessor('id', {
                    header: 'Booking Id',
                    cell: ({ getValue }) => (
                        <BookingId bookingId={getValue()} />
                    ),
                }),
                createColumn.accessor('status', {
                    header: 'Status',
                    size: 200,
                    cell: ({ getValue }) => (
                        <BookingStatus status={getValue()} />
                    ),
                }),
                createColumn.accessor('createdAt', {
                    header: 'Created at',
                    size: 200,
                    cell: ({ getValue }) => formatBookingDate(getValue()),
                }),
                ...bookingDataColumns,
            ]),
        [bookingDataColumns, createColumn],
    );

    const table = useTable({
        features: bookingsTableFeatures,
        columns,
        data,
        defaultColumn: {
            minSize: 100,
            maxSize: 300,
        },
        initialState: {
            pagination: {
                pageSize: 20,
                pageIndex: 0,
            },
        },
    });

    return (
        <div className={styles.bookingTable}>
            <div className={styles.tableWrapper}>
                <table
                    className={styles.table}
                    width={table.getCenterTotalSize()}
                >
                    <THead table={table} />
                    <TBody table={table} />
                </table>
            </div>

            <BookingsTablePagination table={table} />
        </div>
    );
};
