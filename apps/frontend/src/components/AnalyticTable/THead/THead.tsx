import type { ReactTable } from '@tanstack/react-table';
import { type AnalyticTableFeatures } from '#components/AnalyticTable/utils/analyticTableFeatures.ts';
import type { BookingItem } from '#api/bookings/getOrganizationBookings.ts';
import type { FC } from 'react';
import styles from './THead.module.scss';

interface THeadProps {
    table: ReactTable<AnalyticTableFeatures, BookingItem>;
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
                                    minWidth: header.getSize(),
                                    maxWidth: header.getSize(),
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
