import type { ReactTable } from '@tanstack/react-table';
import type { AnalyticTableFeatures } from '#components/AnalyticTable/utils/analyticTableFeatures.ts';
import type { BookingItem } from '#api/bookings/getOrganizationBookings.ts';
import type { FC } from 'react';
import styles from './TBody.module.scss';

interface TBodyProps {
    table: ReactTable<AnalyticTableFeatures, BookingItem>;
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
                                minWidth: cell.column.getSize(),
                                maxWidth: cell.column.getSize(),
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
