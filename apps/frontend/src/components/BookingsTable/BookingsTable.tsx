import { type FC, useCallback, useMemo, useState } from 'react';
import styles from './BookingsTable.module.scss';
import { BookingDialog } from '#components/BookingsTable/BookingDialog/BookingDialog.tsx';
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
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
        null,
    );

    const handleDialogOpenChange = useCallback((open: boolean) => {
        if (!open) {
            setSelectedBookingId(null);
        }
    }, []);

    const createColumn = createColumnHelper<
        BookingsTableFeatures,
        BookingByIdItem
    >();

    const dataKeys = useMemo(() => getDataKeys(data), [data]);

    const bookingDataColumns = useMemo(() => {
        return dataKeys.map((key) =>
            createColumn.accessor(
                (row) => readBookingDataValue(row.data, key),
                {
                    id: `data.${key}`,
                    header: key,
                    cell: ({ getValue }) => <SimpleCell data={getValue()} />,
                },
            ),
        );
    }, [createColumn, dataKeys]);

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
                    <TBody table={table} onClick={setSelectedBookingId} />
                </table>
            </div>

            <BookingsTablePagination table={table} />

            <BookingDialog
                selectedBookingId={selectedBookingId}
                bookings={data}
                dataKeys={dataKeys}
                onOpenChange={handleDialogOpenChange}
            />
        </div>
    );
};
