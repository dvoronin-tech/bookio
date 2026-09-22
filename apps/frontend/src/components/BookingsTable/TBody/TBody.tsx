import type { ReactTable } from '@tanstack/react-table';
import type { BookingsTableFeatures } from '#components/BookingsTable/bookingsTableFeatures.ts';
import type { BookingByIdItem } from '#api/bookings/getBookingsById.ts';
import type { FC } from 'react';
import styles from './TBody.module.scss';

interface TBodyProps {
    table: ReactTable<BookingsTableFeatures, BookingByIdItem>;
}

export const TBody: FC<TBodyProps> = ({ table }) => {
    return (
        <tbody>
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={styles.row}>
                    {row.getAllCells().map((cell) => (
                        <td
                            key={cell.id}
                            className={styles.cell}
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
