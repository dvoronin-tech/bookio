import { type FC, useMemo } from 'react';
import styles from './BookingsTable.module.scss';
import { createColumnHelper, useTable } from '@tanstack/react-table';
import bookingsTableFeatures, {
    type BookingsTableFeatures,
} from '#components/BookingsTable/bookingsTableFeatures.ts';
import type { BookingByIdItem } from '#api/bookings/getBookingsById.ts';
import { BookingId } from '#components/BookingsTable/components/BookingId.tsx';
import { formatBookingDate } from '#components/BookingsTable/utils/format.ts';
import { getDataKeys } from '#components/BookingsTable/utils/getDataKeys.ts';
import { readBookingDataValue } from '#components/BookingsTable/utils/readBookingDataValue.ts';
import { BookingStatus } from '#components/BookingsTable/components/BookingStatus.tsx';
import { THead } from '#components/BookingsTable/THead/THead.tsx';
import { TBody } from '#components/BookingsTable/TBody/TBody.tsx';
import { BookingsTablePagination } from '#components/BookingsTable/BookingsTablePagination/BookingsTablePagination.tsx';
import { SimpleCell } from '#components/BookingsTable/components/SimpleCell.tsx';

interface BookingsTableProps {
    data: BookingByIdItem[];
}

export const BookingsTable: FC<BookingsTableProps> = ({ data }) => {
    const createColumn = createColumnHelper<
        BookingsTableFeatures,
        BookingByIdItem
    >();

    const bookingDataColumns = useMemo(() => {
        const keys = getDataKeys(data);

        return keys.map((key) =>
            createColumn.accessor(
                (row) => readBookingDataValue(row.data, key),
                {
                    id: `data.${key}`,
                    header: key,
                    cell: ({ getValue }) => <SimpleCell data={getValue()} />,
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
                    cell: ({ getValue }) => (
                        <SimpleCell data={formatBookingDate(getValue())} />
                    ),
                }),
                ...bookingDataColumns,
            ]),
        [bookingDataColumns, createColumn],
    );

    const table = useTable({
        features: bookingsTableFeatures,
        columns,
        data,
        columnResizeMode: 'onChange',
        defaultColumn: {
            minSize: 100,
            maxSize: 500,
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
