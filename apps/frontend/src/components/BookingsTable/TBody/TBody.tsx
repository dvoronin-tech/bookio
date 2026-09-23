import type { ReactTable } from '@tanstack/react-table';
import type { BookingsTableFeatures } from '#components/BookingsTable/bookingsTableFeatures.ts';
import type { BookingByIdItem } from '#api/bookings/getBookingsById.ts';
import type { FC } from 'react';
import clsx from 'clsx';
import styles from './TBody.module.scss';

interface TBodyProps {
    table: ReactTable<BookingsTableFeatures, BookingByIdItem>;
    onClick?: (booking: string) => void;
}

export const TBody: FC<TBodyProps> = ({ table, onClick }) => {
    const isResizingCol = table.state.columnResizing.isResizingColumn;

    return (
        <tbody>
            {table.getRowModel().rows.map((row) => (
                <tr
                    key={row.id}
                    className={styles.row}
                    onClick={() => onClick?.(row.original.id)}
                >
                    {row.getAllCells().map((cell) => (
                        <td
                            key={cell.id}
                            className={clsx(
                                styles.cell,
                                cell.column.id === isResizingCol &&
                                    styles.resizeBorder,
                            )}
                            style={{
                                width: cell.column.getSize(),
                            }}
                        >
                            <table.FlexRender cell={cell} />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};
