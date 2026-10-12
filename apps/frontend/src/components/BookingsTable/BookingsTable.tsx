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
import { BookingCard } from './BookingCard/BookingCard.tsx';

interface BookingsTableProps {
    data: BookingByIdItem[];
}

export const BookingsTable: FC<BookingsTableProps> = ({ data }) => {
    const [view, setView] = useState<'table' | 'cards'>('table');
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
            <div className={styles.toolbar}>
                <h2 className={styles.title}>Bookings</h2>
                <div
                    className={styles.viewSwitcher}
                    role="group"
                    aria-label="Booking view"
                >
                    <button
                        type="button"
                        aria-pressed={view === 'table'}
                        onClick={() => setView('table')}
                    >
                        <svg viewBox="0 0 20 20" aria-hidden="true">
                            <rect x="3" y="3" width="14" height="14" rx="2" />
                            <path d="M3 8h14M3 12.5h14M8 8v9" fill="none" />
                        </svg>
                        Table
                    </button>
                    <button
                        type="button"
                        aria-pressed={view === 'cards'}
                        onClick={() => setView('cards')}
                    >
                        <svg viewBox="0 0 20 20" aria-hidden="true">
                            <rect x="3" y="3" width="5.5" height="5.5" rx="1" />
                            <rect
                                x="11.5"
                                y="3"
                                width="5.5"
                                height="5.5"
                                rx="1"
                            />
                            <rect
                                x="3"
                                y="11.5"
                                width="5.5"
                                height="5.5"
                                rx="1"
                            />
                            <rect
                                x="11.5"
                                y="11.5"
                                width="5.5"
                                height="5.5"
                                rx="1"
                            />
                        </svg>
                        Cards
                    </button>
                </div>
            </div>
            <div className={styles.tableWrapper}>
                {view === 'table' ? (
                    <table
                        className={styles.table}
                        width={table.getCenterTotalSize()}
                    >
                        <THead table={table} />
                        <TBody table={table} onClick={setSelectedBookingId} />
                    </table>
                ) : (
                    <div className={styles.cards}>
                        {table
                            .getRowModel()
                            .rows.map(({ original: booking }) => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    dataKeys={dataKeys}
                                    onClick={() =>
                                        setSelectedBookingId(booking.id)
                                    }
                                />
                            ))}
                    </div>
                )}
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
