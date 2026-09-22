import type { ReactTable } from '@tanstack/react-table';
import type { BookingsTableFeatures } from '#components/BookingsTable/bookingsTableFeatures.ts';
import type { BookingByIdItem } from '#api/bookings/getBookingsById.ts';
import type { FC } from 'react';
import styles from './THead.module.scss';

interface THeadProps {
    table: ReactTable<BookingsTableFeatures, BookingByIdItem>;
}

export const THead: FC<THeadProps> = ({ table }) => {
    return (
        <thead className={styles.thead}>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                            <th
                                key={header.id}
                                className={styles.headerCell}
                                style={{
                                    width: header.getSize(),
                                }}
                            >
                                {header.isPlaceholder ? null : (
                                    <table.FlexRender header={header} />
                                )}
                            </th>
                        );
                    })}
                </tr>
            ))}
        </thead>
    );
};
